import { GameTotalScore } from './../../models/entities/gameTotalScore';
import { ToastModule } from 'primeng/toast';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from './../../services/game.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameTotalScoreService } from 'src/app/services/game-total-score.service';
import { Messages } from 'src/app/constants/Messages';

@Component({
	selector: 'app-game-matchmaking',
	templateUrl: './game-matchmaking.component.html',
	styleUrls: ['./game-matchmaking.component.css']
})
export class GameMatchmakingComponent {
	gameText: string;

	@ViewChild('processDiv', { static: true })
	processDivRef: ElementRef<HTMLDivElement>;

	progressBarDivVisible: boolean;
	gameTextDivVisible: boolean;
	currentNickName: string = "";

	isMatchRandomPlayersGame: boolean = false;
	isMatchTwoPlayersGame: boolean = false;
	hostUserNickName: string = "";
	guestUserNickName: string = "";
	constructor(
		private gameService: GameService,
		private gameTotalScoreService: GameTotalScoreService,
		private authService: AuthService,
		private toastrService: ToastrService,
		private router: Router,
		private activatedRouter: ActivatedRoute) {

	}

	ngOnInit() {
		this.progressBarDivVisible = false;
		this.gameTextDivVisible = true;
		this.gameText = "Oyuna katıl";
		this.currentNickName = this.authService.getCurrentNickName();
		this.getGameTotalScoreByNickName();


		this.activatedRouter.queryParams.subscribe((response: any) => {
			if (response && response.hostUserNickName && response.guestUserNickName) {
				this.hostUserNickName = response.hostUserNickName;
				this.guestUserNickName = response.guestUserNickName;
				this.isMatchRandomPlayersGame = false;
				this.isMatchTwoPlayersGame = true;
			} else {
				this.isMatchRandomPlayersGame = true;
				this.isMatchTwoPlayersGame = false;
			}
		});
	}

	ngDoCheck() {

	}

	matchmakingRandomUserStart() {
		this.gameService.sendMatchmaking('');
		this.gameService.getNewMatchmakingResponse().subscribe(
			(response: any) => {
				if (response.message === "Matchmaking Search") {
					this.progressBarDivVisible = true;
					this.gameText = "Oyuncu Aranıyor..."
				}
				else if (response.message === "Matchmaking Join") {
					this.progressBarDivVisible = false;
					this.gameText = "Oyuncu Bulundu..."
				}
				else if (response.message === "Matchmaking Finish") {
					this.progressBarDivVisible = false;
					this.gameText = "Yönlendiriliyor..."
					this.gameService.getGameRoomId().subscribe((response: any) => {
						if (response != null && response !== undefined) {
							setTimeout(() => {
								const queryParams = { 'room-id': response.message };
								this.gameService.removeGameRoomId();
								this.gameService.removeNewMatchmaking();
								this.gameService.removeMatchmakingResponse();
								this.router.navigate(['/game'], { queryParams });
							}, 1000);
						}
					})
				}
			},
			(error) => {
				console.error('Error reading matchmaking response:', error);
			}
		);
	}

	matchmakingTwoUserStart(hostUserNickName: string, guestUserNickName: string) {
		let matchmakingTwoUserModel: any = {
			hostUserNickName: hostUserNickName,
			guestUserNickName: guestUserNickName
		}
		this.gameService.sendMatchmakingTwoUser(matchmakingTwoUserModel);
		this.gameService.getNewMatchmakingTwoResponse().subscribe(
			(response: any) => {
				console.log("response", response.message);

				if (response.message === "Matchmaking Two Waiting") {
					this.progressBarDivVisible = true;
					this.gameText = "Oyuncu Bekleniyor..."
				}
				else if (response.message === "Matchmaking Two Join") {
					this.progressBarDivVisible = false;
					this.gameText = "Oyuncu Katıldı..."
				}
				else if (response.message === "Matchmaking Two Finish") {
					this.progressBarDivVisible = false;
					this.gameText = "Yönlendiriliyor..."
					this.gameService.getGameRoomId().subscribe((response: any) => {
						if (response != null && response !== undefined) {
							setTimeout(() => {
								const queryParams = { 'room-id': response.message };
								console.log("reoom id" , response.message);

								this.gameService.removeGameRoomId();
								this.gameService.removeNewMatchmakingTwoUser();
								this.gameService.removeMatchmakingTwoResponse();
								this.router.navigate(['/game'], { queryParams });
							}, 1000);
						}
					})
				}
			},
			(error) => {
				console.error('Error reading matchmaking response:', error);
			}
		);
	}

	matchGame() {
		this.gameService.connectSocket();
		if (this.hostUserNickName != "" && this.guestUserNickName != "") {
			this.matchmakingTwoUserStart(this.hostUserNickName, this.guestUserNickName);
		} else {
			this.matchmakingRandomUserStart();
		}
	}

	getGameTotalScoreByNickName() {
		this.gameTotalScoreService.getByNickName(this.currentNickName).subscribe(response => {
			if (response.success && (response.data == null || response.data == undefined)) {
				this.addGameTotalScore();
			}
		}, errorResponse => {
			if (errorResponse.error) {
				this.toastrService.error(Messages.error);
			}
		})
	}
	addGameTotalScore() {
		let currentUserId = this.authService.getCurrentUserId();
		let gameTotalGameScore: GameTotalScore = {
			id: 0,
			userId: currentUserId,
			totalScore: 0,
			totalWin: 0,
			totalLose: 0,
			updateTime: new Date(),
			status: true
		}
		this.gameTotalScoreService.add(gameTotalGameScore).subscribe(response => {
		}, errorResponse => {
			if (errorResponse.error) {
				this.toastrService.error(Messages.error);
			}
		});
	}
}
