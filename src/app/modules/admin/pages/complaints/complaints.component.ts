import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ComplaintsService } from 'src/app/shared/services/complaints/complaints.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss'],
})
export class ComplaintsComponent implements OnInit {
  complaints: any = [];
  complaintId: any;

  gridLayout = false;
  confirmationDialog = false;

  constructor(private complaintService: ComplaintsService) {}

  ngOnInit(): void {
    this.getComplaints();
  }

  getComplaints = () => {
    this.complaintService.getAllComplaints().subscribe((data: any) => {
      this.complaints = data.sort(
        (a: any, b: any) => b.complaintId - a.complaintId
      );
    });
  };

  onRemove = (complaint: any) => {
    this.complaintId = complaint.complaintId;
    this.confirmationDialog = true;
  };

  onDelete = () => {
    this.complaintService
      .updateComplaint(this.complaintId, {
        status: false,
      })
      .subscribe(() => {
        this.getComplaints();
        this.confirmationDialog = false;
      });
  };

  onCloseConfirmationDialog = () => {
    this.confirmationDialog = false;
  };
}
