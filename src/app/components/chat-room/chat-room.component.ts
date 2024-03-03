import { ToastrService } from 'ngx-toastr';
import { ChatRoomProperty } from './../../models/entities/chatRoomProperty';
import { UserService } from 'src/app/services/user.service';
import { ChatRoomMessageModel } from './../../models/model/chatRoomMessageModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ChatRoomUserService } from 'src/app/services/chat-room-user.service';
import { ChatRoomUser } from 'src/app/models/entities/chatRoomUser';
import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarObj } from 'src/app/models/entities/avatarObj';
import { StructureObj } from 'src/app/models/entities/structureObj';
import { AvatarService } from 'src/app/services/avatar.service';
import { findCllsn } from 'src/app/utilities/chat/findCllsn';
import { RandomNumber } from 'src/app/utilities/randomNumber';
import { ChatRoomUserByUserDto } from 'src/app/models/dto/chatRoomUserByUserDto';
import { ChatRoomService } from 'src/app/services/chat-room.service';
import { ChatRoomPlayerModel } from 'src/app/models/model/chatRoomPlayerModel';
import { User } from 'src/app/models/entities/user';
import { ChatRoomOperationModel } from 'src/app/models/model/chatRoomOperationModel';
import { ChatRoom } from 'src/app/models/entities/chatRoom';
import { Messages } from 'src/app/constants/Messages';
import { switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { UserInfoService } from 'src/app/services/user-info.service';
import { UserInfo } from 'src/app/models/entities/userInfo';
import { environment } from 'src/environments/environment';
import { GameInvateModel } from 'src/app/models/model/gameInvateModel';

@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent {
	chatMessageForm: FormGroup;
	chatRoomAccessId: string = "";
	isArrowUpPressed: boolean = false;
	isArrowDownPressed: boolean = false;
	isChatLogActive: boolean = false;

	@ViewChild('myCanvas')
	canvas: ElementRef<HTMLCanvasElement>;
	context: CanvasRenderingContext2D;

	w: number;
	h: number;

	img: HTMLImageElement;
	fountainStructure: StructureObj;
	npcs: any[] = [];
	worldObjs: any[] = [];

	player: any;
	playerArray: any[] = [];
	playerTotalArray: ChatRoomPlayerModel[] = [];
	chatRoomUsersByUserDto: ChatRoomUserByUserDto[] = [];

	messages: ChatRoomMessageModel[] = [];
	newMessage: string = '';

	gameInvateModel: GameInvateModel;

	screenHeight: number;
	screenWidth: number;

	//chat speech
	isMuteVisible: boolean = true;
	operations: ChatRoomOperationModel[] = [];

	chatRoomSubject = new BehaviorSubject<ChatRoom | null>(null);
	chatRoom$ = this.chatRoomSubject.asObservable();

	currentUserNickName: string;
	userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
	userInfo$ = this.userInfoSubject.asObservable();
	userInfo: UserInfo;

	chatRoom: ChatRoom;
	messagesContentRef: ElementRef;

	constructor(
		private avatarService: AvatarService,
		private chatRoomUserService: ChatRoomUserService,
		private formBuilder: FormBuilder,
		private chatRoomService: ChatRoomService,
		private authService: AuthService,
		private userService: UserService,
		private userInfoService: UserInfoService,
		private el: ElementRef,
		private route: ActivatedRoute,
		private router: Router,
		private renderer: Renderer2,
		private toastrService: ToastrService) {
		// chatRoomPropertyService
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			const accessId = params.get('accessId');
			this.chatRoomAccessId = accessId; //accesIdControlü yap
			this.currentUserNickName = this.authService.getCurrentNickName();
			this.getUserInfoByNickName(this.currentUserNickName);
			this.getChatRoomByAccessId();
		});

		this.userInfo$.subscribe(response => {
			if (response) {
				this.userInfo = response;
			}
		})
		this.createChatMessageForm();
		this.chatRoomService.connectSocket();
		let response: any = { "data": this.chatRoomAccessId, "messages": "accessId", "success": true };
		this.chatRoomService.sendChatRoomConnected(response);
	}


	createChatMessageForm() {
		this.chatMessageForm = this.formBuilder.group({
			message: ["", Validators.compose([Validators.required, Validators.nullValidator, Validators.minLength(0), Validators.maxLength(50)])],
		})
	}

	ngAfterViewInit(): void {
		this.getScreenSize();
		this.canvas.nativeElement.height = this.screenHeight - 200;
		this.canvas.nativeElement.width = this.screenWidth - 100;
		this.context = this.canvas.nativeElement.getContext('2d');
		this.w = this.canvas.nativeElement.width;
		this.h = this.canvas.nativeElement.height;

		//çeşme için nesne oluşturuyoruz.
		this.img = new Image();
		this.img.src = "https://i.ibb.co/GTsDmJF/fountain.png";
		this.fountainStructure = new StructureObj(300, 200, (this.w / 2) - 150, 100, 70, this.img, true, 12);
		this.getChatRoomUserByUserDto(() => {
			this.createUsers();
			this.createChatObject()
			this.runAI();
			this.runDisplay();
		});
		this.getMessageResponse();
		this.getPlayerResponse();
		this.getOperationResponse();
		this.chatRoom$.subscribe(response => {
			if (response) {
				this.chatRoom = response;
			}
		})
	}

	createChatObject() {
		this.createNPCs();
		//ortamdaki objeleri worldObjs içinde topluyoruz.
		this.worldObjs[0] = this.player;
		for (var sn in this.npcs) {
			const numericSn = +sn + 1;
			this.worldObjs[numericSn] = this.npcs[numericSn - 1];
		}
		this.worldObjs[this.worldObjs.length] = this.fountainStructure;
		for (let index = 0; index < this.playerArray.length; index++) {
			this.worldObjs[this.worldObjs.length + index] = this.playerArray[index];
		}
	}

	createUsers() {
		let currentUserId: number = this.authService.getCurrentUserId();
		let counter: number;

		counter = 0;
		for (let index = 0; index < this.chatRoomUsersByUserDto.length; index++) {
			if (currentUserId != this.chatRoomUsersByUserDto[index].userId) {
				this.playerArray[counter] = new AvatarObj(this.chatRoomUsersByUserDto[index].nickName, 1, 0, 30, 60, 3, 28, 2, this.canvas.nativeElement.width / 2 - index * 30, this.canvas.nativeElement.height * 0.8 - index * 10, 0);
				counter++;
			}
			else {
				this.player = new AvatarObj(this.chatRoomUsersByUserDto[index].nickName, 1, 0, 30, 60, 3, 28, 2, this.canvas.nativeElement.width / 2 - 15, this.canvas.nativeElement.height * 0.8 - 54, 0);
			}
		}
	}

	getChatRoomUserByUserDto(callback: () => void) {
		this.chatRoomUserService.getByAccessId(this.chatRoomAccessId).subscribe(response => {
			if (response.success) {
				this.chatRoomUsersByUserDto = response.data;
				callback();
			}
		})
	}

	createNPCs() {
		//1->female 0->male
		const NameObj = (name: string, gender: number) => ({
			name: name,
			gender: gender
		}),

			npcNames = [
				NameObj("Alice", 1),
				NameObj("Jack", 0),
				NameObj("Jill", 1)
			],

			avatarW = 30,
			avatarH = 60;

		for (const npcn in npcNames) {
			let chooseSkin = RandomNumber(0, 3),
				placeX = RandomNumber(0, this.w - avatarW),
				placeY = RandomNumber(avatarH, this.h - 54 - avatarH);

			this.npcs[npcn] = new AvatarObj(npcNames[npcn].name, npcNames[npcn].gender, chooseSkin,
				avatarW, avatarH, 3, 28, 2, placeX, placeY, 8);

			if (findCllsn(this.npcs[npcn], this.worldObjs)) {
				this.npcs[npcn].x = this.player.x;
				this.npcs[npcn].y = this.player.y;
			}
			//bu if'i silersem npcler çeşmenin üzerinde duruyor. Silme!
		}
	}

	runAI() {
		for (var ai in this.npcs) {
			this.avatarService.npcAI(this.npcs[ai]);
		}
		setTimeout(() => {
			this.runAI(); // runAI fonksiyonunu tekrar çağırır
		}, 400);
	}


	drawStructure(strctr: StructureObj) {
		if (strctr.img === null) {
			this.context.fillStyle = "#aaa";
			this.context.fillRect(strctr.x, strctr.y, strctr.w, strctr.h);
		} else if (strctr.isAnim) {
			//buraya giriyor
			this.context.drawImage(strctr.img, strctr.w * (strctr.curFrame - 1), 0, strctr.w, strctr.h, strctr.x, strctr.y - strctr.backArea, strctr.w, strctr.h);
			++strctr.curFrame;
			if (strctr.curFrame > strctr.frames) {
				strctr.curFrame = 1;
			}
		} else {
			this.context.drawImage(strctr.img, strctr.x, strctr.y, strctr.w, strctr.h);
		}
	}

	runDisplay = () => {

		this.context.clearRect(0, 0, this.w, this.h);

		var imgG: HTMLImageElement = new Image();
		imgG.src = "https://i.ibb.co/TqMC0Dp/grass.png";

		let ground = this.context.createPattern(imgG, 'repeat');
		let pathW = 50,
			path = this.context.createLinearGradient(this.w / 2 - pathW / 2, 0, this.w / 2 + pathW / 2, 0);

		path.addColorStop(0.05, "#863");
		path.addColorStop(0.05, "#974");
		path.addColorStop(0.95, "#974");
		path.addColorStop(0.95, "#753");

		this.context.fillStyle = ground;
		this.context.fillRect(0, 0, this.w, this.h);

		this.context.fillStyle = path;
		this.context.fillRect(this.w / 2 - pathW / 2, 220, pathW, this.h - 200);

		// sort avatars and structures ascending by Y position so that they each arent standing on top of another
		this.worldObjs.sort(function (a, b) {
			return a.y - b.y;
		});

		// render everything
		for (var wo in this.worldObjs) {
			// to determine if avatar, test for name
			if (this.worldObjs[wo].name) {
				this.avatarService.moveAvatar(this.worldObjs[wo], this.w, this.h, this.worldObjs);
				this.avatarService.drawAvatar(this.worldObjs[wo], this.context);
			} else {
				this.drawStructure(this.worldObjs[wo]);
			}
		}
		setTimeout(() => {
			this.runDisplay();
		}, 1000 / 60);
	}

	//message

	sendMessage() {
		// Kullanıcının girdiği metni mesajlar dizisine ekleyin
		let newMessage: ChatRoomMessageModel = {
			text: this.newMessage,
			sender: this.player.name,
			date: new Date(),
			imageUrl: this.userInfo?.profileImagePath,
			gameInvateModel: {
				hostUserNickName: null,
				guestUserNickName: null
			},
			isInterpreted: false
		};
		let isInterpreted = this.messageInterpreter(newMessage);
		if (isInterpreted == true) {
			let newGameInvateModel = {
				...newMessage.gameInvateModel,
				hostUserNickName: this.gameInvateModel?.hostUserNickName,
				guestUserNickName: this.gameInvateModel?.guestUserNickName
			}
			newMessage.gameInvateModel = newGameInvateModel;
		}
		newMessage.isInterpreted = isInterpreted;

		this.messages.push(newMessage);
		this.newMessage = '';
	}

	sendMessageClick() {
		let chatMessageForm: any = Object.assign({}, this.chatMessageForm.value)
		let messageTextDown = chatMessageForm.message;
		if (messageTextDown) {
			this.newMessage = messageTextDown;
		}
		if (this.newMessage == "")
			return;
		this.player.updateLastMessage(this.newMessage);
		this.sendMessage();
		this.chatMessageForm.setValue({ "message": "" });
		let data = {
			"messages": this.messages, "accessId": this.chatRoomAccessId, "operations": this.operations
		}
		let responseMessage = { message: 'Message Text', data: data };
		let responseOperation = { message: 'Message Text', data: data };
		this.chatRoomService.sendChatRoomHandleMessage(responseMessage);
		this.chatRoomService.sendChatRoomHandleOperations(responseOperation);
		setTimeout(() => {
			this.updateScrollBarChat();
		}, 100);
	}

	toggleChatLog() {
		this.isChatLogActive = !this.isChatLogActive;
	}

	getMessageResponse() {
		this.chatRoomService.getMessageResponse().subscribe((response: any) => {
			let nowDate: Date = new Date();
			const millisecondsToSubtract = 500;
			if (response.data !== undefined || response.data != null) {
				this.messages = response.data;
				response.data.forEach((element: any) => {
					let result = this.playerArray.find(x => x.name === element.sender);
					let date: Date = new Date(element.date);
					let timeOk = ((nowDate.getTime() - date.getTime()) < millisecondsToSubtract);

					if ((result !== undefined || result != null) && timeOk) {
						result.updateLastMessage(element.text);
						setTimeout(() => {
							this.updateScrollBarChat();
						}, 100);
					}
				});

				if (this.messages.length > 100) {
					this.messages = [];
				}
			}
		})
	}

	chatRoomMessageInput(event: any) {
		this.newMessage = event;
		return event;
	}

	chatRoomOperationMute(key: string, value: any) {
		let operation: ChatRoomOperationModel;
		let nowDate: Date = new Date();
		let afterNextDate: Date;

		afterNextDate = new Date(nowDate.getTime() + nowDate.getMilliseconds() + 100000);
		operation = {
			propertyName: key,
			nickName: value,
			endOfTime: afterNextDate
		}
		this.sendChatRoomOperation(operation);
		if (this.authService.getCurrentNickName() === value && this.authService.getCurrentUserId() != this.chatRoom.roomUserId){
			this.isMuteVisible = false;
		}else{
			this.toastrService.info(Messages.notChatRoomAdmin, String(this.chatRoom.roomUserId) + " " + String(this.authService.getCurrentUserId()))
		}
		setTimeout(() => {
			if (this.authService.getCurrentNickName() === value) {
				this.isMuteVisible = true;
			}
		}, operation.endOfTime.getMilliseconds() * 9);
	}

	chatRoomOperationAdmin(key: string, value: any) {
		let operation: ChatRoomOperationModel;
		operation = {
			propertyName: key,
			nickName: value,
			endOfTime: null
		}
		this.sendChatRoomOperation(operation);
		if (this.authService.getCurrentUserId() != this.chatRoom.roomUserId) {
			this.newMessage = Messages.notChatRoomAdmin;
			this.sendMessage();
			// this.toastrService.info(Messages.notChatRoomAdmin, Messages.info)
			return;
		}
		this.getUserByNickNameForChatRoomUpdate(this.chatRoom, value);
	}

	chatRoomOperationGameInvate(key: string, value: any) {
		this.gameInvateModel = {
			hostUserNickName: String(this.authService.getCurrentNickName()),
			guestUserNickName: String(value.trim())
		}
	}

	chatRoomUpdate(chatRoom: ChatRoom, nickName: string) {
		this.chatRoomService.update(chatRoom).pipe(take(1)).subscribe({
			next: (response) => {
				if (response.success) {
					this.newMessage = "Yeni Oda Sahibi: " + nickName
					this.sendMessage();
				}
			},
			error: (responseError)=>{
				if (responseError.error) {
					this.toastrService.error(Messages.error, Messages.error);
				}
			}
		});
	}

	getUserByNickNameForChatRoomUpdate(chatRoom: ChatRoom, nickName: string) {
		this.userService.getByNickName(nickName).subscribe({
			next: (response) => {
				if (response.success) {
					chatRoom.roomUserId = response.data.id
					this.chatRoomUpdate(chatRoom, nickName);
				}
			},
			error: (responseError) => {
				if (responseError.error) {
					this.toastrService.error(Messages.error, Messages.error);
				}
			}
		});
	}

	getUserInfoByNickName(nickName: string) {
		this.userInfoService.getByNickName(nickName).subscribe({
			next: (response) => {
				if (response.success) {
					this.userInfoSubject.next(response.data);
				}
			},
			error: (responseError) => {
				if (responseError.error) {
					this.toastrService.error(Messages.error, Messages.error);
				}
			}
		});
	}

	messageInterpreter(newMessage: any): boolean {
		let message: string = newMessage.text;
		let keyValueArray = message.split(":");
		let key = keyValueArray[0];
		let value = keyValueArray[1];

		const colonCount = (message.match(/:/g) || []).length;
		if (colonCount == 1 && message.indexOf(":") > 0) {
			if (key === "mute") {
				this.chatRoomOperationMute(key, value);
				return true;
			} else if (key === "admin") {
				this.chatRoomOperationAdmin(key, value);
				return true;
			} else if (key === "game-invate") {
				this.chatRoomOperationGameInvate(key, value);
				return true;
			}
		}
		return false;
	}

	sendChatRoomOperation(operation: ChatRoomOperationModel) {
		let finededOperation = this.operations.find(x => x.nickName === operation.nickName && x.propertyName === operation.propertyName)
		if (!finededOperation) {
			this.operations.push(operation);
		}
	}

	getOperationResponse() {
		this.chatRoomService.getOperationResponse().subscribe((response: any) => {
			if (response.data !== undefined || response.data != null) {

				response.data.forEach((element: ChatRoomOperationModel) => {
					if (element.propertyName === "mute") {
						this.chatRoomOperationMute(element.propertyName, element.nickName);
					} else if (element.propertyName === "admin") {
						this.chatRoomOperationAdmin(element.propertyName, element.nickName);
					}
				});
			}
		})
	}

	updateScrollBar(messagesContentRef: ElementRef) {
		this.messagesContentRef = messagesContentRef;
	}

	updateScrollBarChat() {
		const messagesContent = this.messagesContentRef?.nativeElement;
		if (messagesContent === undefined)
			return;
		this.renderer.setProperty(messagesContent, 'scrollTop', messagesContent.scrollHeight);
	}

	//playerMove

	sendPlayerMove(chatRoomPlayerMove: ChatRoomPlayerModel) {
		this.playerTotalArray.push(chatRoomPlayerMove);
	}

	getPlayerResponse() {
		this.chatRoomService.getPlayerResponse().subscribe((response: any) => {
			if (response.data) {
				for (let index = 0; index < response.data.length; index++) {
					const element = response.data[index];
					if (element) {
						const result = this.playerArray.find((player: any) => player.name === element.name);
						if (result) {
							result.x = element.x;
							result.y = element.y;
							result.dir = element.dir;
						}
					}
				}

				if (this.playerTotalArray.length > 100) {
					this.playerTotalArray = [];
				}
			}
		});
	}

	sendHandlePlayer() {
		let chatRoomPlayerModels: ChatRoomPlayerModel[] = this.playerArray.map((player: any) => ({ name: player.name, x: player.x, y: player.y, dir: player.dir }));
		let chatRoomPlayerModel: ChatRoomPlayerModel = {
			name: this.player.name,
			x: this.player.x,
			y: this.player.y,
			dir: this.player.dir
		};

		chatRoomPlayerModels.push(chatRoomPlayerModel);
		for (const iterator of chatRoomPlayerModels) {
			const playerFinded = this.playerTotalArray.find((player: any) => player.name === iterator.name);
			if (!playerFinded) {
				this.sendPlayerMove(iterator);
			} else {
				this.playerTotalArray.pop();
			}
		}
		const data = { "playerTotalArray": this.playerTotalArray, "accessId": this.chatRoomAccessId };
		const response = { message: 'Player', data: data };
		this.chatRoomService.sendChatRoomHandlePlayer(response);
	}

	getChatRoomByAccessId() {
		this.chatRoomService.getByAccessId(this.chatRoomAccessId).subscribe(response => {
			if (response.success) {
				this.chatRoomSubject.next(response.data);
			}
		}, responseError => {
			if (responseError.error) {
				this.toastrService.error(Messages.error, Messages.error);
			}
		});
	}

	@HostListener('window:keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp') {
			this.isArrowUpPressed = true;
		} else if (event.key === 'ArrowDown') {
			this.isArrowDownPressed = true;
		}
		this.sendHandlePlayer();
		this.avatarService.control(this.player, event);
	}

	@HostListener('window:keyup', ['$event'])
	onKeyUp(event: KeyboardEvent) {
		if (event.key === 'ArrowUp') {
			this.isArrowUpPressed = false;
		} else if (event.key === 'ArrowDown') {
			this.isArrowDownPressed = false;
		}
		this.avatarService.stopControl(this.player);
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: Event) {
		this.getScreenSize();
	}

	getScreenSize() {
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;
	}
}
