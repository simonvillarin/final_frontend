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
  complaintToUpdateStatus: any;

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

  onStatusChanges = (status: string) => {
    if (status !== '') {
      this.complaintService.getAllComplaints().subscribe((data: any[]) => {
        this.complaints = data.sort((a: any, b: any) => b.userId - a.userId);

        if (status === 'Active') {
          this.complaints = this.complaints.filter(
            (farmer: any) => farmer.status === true
          );
        } else {
          console.log(false);
          this.complaints = this.complaints.filter(
            (farmer: any) => farmer.status === false
          );
        }
      });
    }
  };

  onStatusChanged = (complaint: any) => {
    this.complaintToUpdateStatus = complaint;
    this.confirmationDialog = true;
  };

  onUpdateStatus(): void {
    this.complaintService
      .updateComplaint(this.complaintToUpdateStatus.complaintId, {
        status: this.complaintToUpdateStatus.status,
      })
      .subscribe(() => {
        this.getComplaints();
        this.confirmationDialog = false;
      });
  }

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
    this.getComplaints();
  };
}
