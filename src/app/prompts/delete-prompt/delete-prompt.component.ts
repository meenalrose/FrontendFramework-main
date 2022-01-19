import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface IncomingData {
  name: string,
  message: string,
}

@Component({
  selector: 'app-delete-prompt',
  templateUrl: './delete-prompt.component.html',
  styleUrls: ['./delete-prompt.component.scss']
})
export class DeletePromptComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeletePromptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IncomingData
  ) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  approveDelete(): void {
    this.dialogRef.close({
      approveDelete: true
    })
  }

}
