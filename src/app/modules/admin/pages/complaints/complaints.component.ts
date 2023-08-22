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
  complaintForm: FormGroup;

  imagePreview: string | ArrayBuffer | null = null;
  file: any;
  complaints: any = [];
  img: any = {};
  complaintId: any;
  complaint_type = [
    'Poor service quality',
    'Failure to meet promised specifications',
    'Wrong Products',
    'Others - will be specified in details',
  ];

  gridLayout = false;
  addDialog = false;
  confirmationDialog = false;
  showImage = false;
  isEditing = false;
  emptyImage = false;

  constructor(
    private complaintService: ComplaintsService, // Inject your complaint service here
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.complaintForm = fb.group({
      farmerId: ['', Validators.required],
      complaintType: ['', Validators.required],
      complaintDetails: ['', Validators.required],
      filename: ['', Validators.required],
      mimeType: ['', Validators.required],
      data: ['', Validators.required],
    });
  }

  get farmerId() {
    return this.complaintForm.get('farmerId') as FormControl;
  }

  get complaintType() {
    return this.complaintForm.get('complaintType') as FormControl;
  }

  get complaintDetails() {
    return this.complaintForm.get('complaintDetails') as FormControl;
  }

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

  onEdit = (complaint: any) => {
    this.complaintId = complaint.complaintId;
    this.addDialog = true;
  };

  onUpdate = () => {
    if (this.complaintForm.valid) {
      this.getComplaints();
      this.complaintForm.reset();
      this.addDialog = false;
    } else {
      this.complaintForm.markAllAsTouched();
    }
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

  openAddDialog = () => {
    this.addDialog = true;
  };

  closeAddDialog = () => {
    this.addDialog = false;
  };
}
