import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from "../app.component";

@Component({
  selector: 'app-modal-username',
  templateUrl: './modal-username.component.html',
  styleUrls: ['./modal-username.component.scss']
})
export class ModalUsernameComponent implements OnInit {

  username: string = "";
  errorMsg: string = "";

  constructor(
    public dialogRef: MatDialogRef<ModalUsernameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData){
      dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(){
    if(this.username == "" || this.username == null) {
      this.errorMsg = "Veuillez entrer un pseudo !";
    } else {
      this.errorMsg = "";
      this.dialogRef.close(this.username);
    }
  }

}
