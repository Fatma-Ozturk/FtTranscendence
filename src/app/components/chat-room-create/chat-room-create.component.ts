import { ChatRoomTypeService } from './../../services/chat-room-type.service';
import { AuthService } from 'src/app/services/auth.service';
import { RandomNumber } from 'src/app/utilities/randomNumber';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ChatRoomService } from './../../services/chat-room.service';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatRoom } from 'src/app/models/entities/chatRoom';
import { Messages } from 'src/app/constants/Messages';
import { StatusEnum } from 'src/app/models/enums/statusEnum';
import { ChatRoomType } from 'src/app/models/entities/chatRoomType';
import { ChatRoomUserService } from 'src/app/services/chat-room-user.service';
import { ChatRoomUser } from 'src/app/models/entities/chatRoomUser';

@Component({
  selector: 'app-chat-room-create',
  templateUrl: './chat-room-create.component.html',
  styleUrls: ['./chat-room-create.component.css']
})
export class ChatRoomCreateComponent implements OnInit {

  @Output() dialogVisible = new EventEmitter<boolean>();
  chatRoomForm: FormGroup;
  chatRoomTypes: ChatRoomType[] = [];

  isStatus: any[] = [String(StatusEnum.Success), String(StatusEnum.Error)];
  selectedStatus: string;

  lockedButtonClass: boolean = false;
  validatorRequired: string = "";
  constructor(private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private chatRoomService: ChatRoomService,
    private chatRoomTypeService: ChatRoomTypeService,
    private chatRoomUserService: ChatRoomUserService) {

  }

  ngOnInit(): void {
    this.createChatRoomForm();
    this.getChatRoomTypes();
  }

  createChatRoomForm() {
    this.chatRoomForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.nullValidator])],
      hasPassword: [false, Validators.compose([Validators.required, Validators.nullValidator])],
      roomTypeId: ['', Validators.compose([Validators.required, Validators.nullValidator])],
    })
  }

  getChatRoomTypes() {
    this.chatRoomTypeService.gets().subscribe(response => {
      if (response.data) {
        this.chatRoomTypes = response.data;
      }
    });
  }

  add() {
    if (this.chatRoomForm.valid) {
      let chatRoomForm: any = Object.assign({}, this.chatRoomForm.value)
      let chatRoomModel: ChatRoom = {
        id: 0,
        name: chatRoomForm.name,
        accessId: "",
        roomTypeId: 0,
        roomUserId: this.authService.getCurrentUserId(),
        hasPassword: chatRoomForm.hasPassword,
        userCount: 0,
        status: true,
        updateTime: new Date(),
      };
      this.confirm(() => { this.addChatRoom(chatRoomModel); this.lockedSaveButton(); }, Messages.add, Messages.add);
      this.validatorRequired = " ng-valid"
    } else {
      this.validatorRequired = " ng-invalid ng-dirty"
      this.toastrService.error(Messages.formInvalid, Messages.error);
    }
  }

  addChatRoom(chatRoom: ChatRoom) {
    this.chatRoomService.add(chatRoom).subscribe(response => {
      if (response.success) {
        this.toastrService.success(Messages.add, Messages.success);
        setTimeout(() => {
          this.unlockedSaveButton();
        }, 500);
      }
    }, responseError => {
      if (responseError.error)
        this.toastrService.error(Messages.notAdd, Messages.error);
    })
  }

  onChangeOperationClaim() {
    let status: boolean
    status = this.selectedStatus == String(StatusEnum.Success) ? true : false
  }

  confirmPosition(event: MouseEvent) {
    if (!this.lockedButtonClass) {
      this.add();
    } else {
      event.preventDefault();
    }
  }

  confirm(callback: () => void, message: string, header: string) {
    this.confirmationService.confirm({
      message: message,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        callback();
        this.dialogVisible.emit(false);
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            break;
          case ConfirmEventType.CANCEL:
            break;
        }
      }
    });
  }

  //utils
  lockedSaveButton() {
    this.lockedButtonClass = true;
  }
  unlockedSaveButton() {
    this.lockedButtonClass = false;
  }
}
