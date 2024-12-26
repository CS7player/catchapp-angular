import { Component, OnInit } from '@angular/core';
import { LsmanagerService } from '../utils/lsmanager.service';
import { Router } from '@angular/router';
import { ApiService } from '../utils/apimanager.service';
import { FormsModule } from '@angular/forms';
import { Constants } from '../utils/constants.service';
@Component({
 selector: 'app-layout',
 standalone: true,
 imports: [FormsModule],
 templateUrl: './layout.component.html',
 styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
 username: string = '';
 userId = '0';
 receiverId = '';
 is_add_friend: boolean = false;
 friend_list: any = [{ user_id: '', name: "no Friends" }];
 add_friend_list: any = [];
 send_req_list: any = [];
 is_receive_List: boolean = false;
 receive_req_list: any = [];
 selected_rec_req: any = [];
 msgText: string = '';
 chat_data: any = [{ msg: 'hi', userId: '0' }, { msg: 'hello', userId: '1' }, { msg: 'what up', userId: '0' }, { msg: 'ntg', userId: '1' }]
 constructor(private ls: LsmanagerService, private router: Router, private apiservice: ApiService) { }
 ngOnInit() {
  let userDetails : any = this.ls.getData('userData');
  if(userDetails.length == 0){
   this.router.navigate(['login']);
   return
  }
  userDetails = JSON.parse(userDetails);
  this.username = userDetails['username']
  this.userId = userDetails['_id'];
  this.getFriends();
  this.getUsers();
  this.getRequest();
 }

 getFriends() {
  let params = { "user_id": this.userId }
  this.apiservice.dopost(Constants.URL + 'friends/friends', params).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.friend_list = res['data'];
    }
   }
  })
 }

 getUsers() {
  let params = { "user_id": this.userId }
  this.apiservice.dopost(Constants.URL + 'friends/users', params).subscribe({
   next: (res: any) => {
    if (res['status']) {
     console.log(res)
     this.add_friend_list = res['data'];
    }
   }
  })
 }

 getRequest() {
  let params = { "user_id": this.userId }
  this.apiservice.dopost(Constants.URL + 'friends/request', params).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.receive_req_list = res['data'];
    }
   }
  })
 }

 addingfriend(obj: any) {
  const index = this.send_req_list.indexOf(obj['_id']);
  if (index == -1) {
   this.send_req_list.push(obj['_id']);
  }
  else {
   this.send_req_list.splice(index, 1);
  }
 }

 sendReq() {
  let params = { 'user_id': this.userId, 'request_list': this.send_req_list }
  this.apiservice.dopost(Constants.URL + 'friends/sendreq', params).subscribe({
   next: (res: any) => {
    if (res['status']) {
     alert('Done')
     this.is_add_friend = false;
    }
   }
  })
 }

 acceptReq(obj: any) {
  const index = this.selected_rec_req.indexOf(obj['_id']);
  if (index == -1) {
   this.selected_rec_req.push(obj['_id']);
  }
  else {
   this.selected_rec_req.splice(index, 1);
  }
 }

 accept() {
  let params = { 'user_id': this.userId, 'accept_list': this.selected_rec_req }
  this.apiservice.dopost(Constants.URL + 'friends/acceptreq', params).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.is_receive_List = false;
     this.getFriends();
    }
   }
  })
 }

 selectFriend(obj: any) {
  this.receiverId = obj['_id'];
  this.getChat();
 }

 logout() {
  this.ls.clearAll();
  this.router.navigate(['login'])
 }

 getChat() {
  let params = { sender_id: this.userId, receiver_id: this.receiverId }
  this.apiservice.dopost(Constants.URL + 'chat/get', params).subscribe({
   next: (res: any) => {
    console.log(res);
    if (res['status']) {
     this.chat_data = res['data'];
    }
   }
  })
 }

 sendmsg() {
  if (this.msgText.length == 0) {
   return
  }
  let params = { sender_id: this.userId, receiver_id: this.receiverId, message: this.msgText }
  this.apiservice.dopost(Constants.URL + 'chat/send', params).subscribe({
   next: (res: any) => {
    if (res['status']) {
     // this.socket.sendnewMsg({sender_id:this.userId,receiver_id:this.receiverId,msg_id:res['insertedId']})
     this.msgText = '';
     this.getChat();
    }
   }
  })
 }
 onEnterPressed(event: any) {
  if (event.key === 'Enter') {
   this.sendmsg()
  }
 }
}
