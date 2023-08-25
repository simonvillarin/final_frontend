import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ComplaintsService } from 'src/app/shared/services/complaints/complaints.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss'],
})
export class ComplaintsComponent {
  complaintForm: FormGroup;
  complaints: any = [];
  complaintId: any;
  complaintType: any = ['Dispute', 'Service', 'Website Issue'];

  gridLayout = false;
  addDialog = false;
  confirmationDialog = false;
  showImage = false;
  isEditing = false;
  emptyImage = false;
  imagePreview: string | ArrayBuffer | null = null;
  file: any;

  constructor(
    private complaintService: ComplaintsService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.complaintForm = fb.group({
      farmerId: ['', Validators.required],
      complaintType: ['', Validators.required],
      complaintDetails: ['', Validators.required],
      filename: ['', Validators.required],
      mimeType: ['', Validators.required],
      data: ['', Validators.required],
      status: [true],
    });
  }

  ngOnInit(): void {
    this.getComplaints();
  }

  getComplaints = () => {
    this.complaintService
      .getAllComplaintsByFarmerId(this.authService.getUserId())
      .subscribe((data: any) => {
        this.complaints = data.sort(
          (a: any, b: any) => b.complaintId - a.complaintId
        );
        console.log(data);
      });
  };

  openAddDialog = () => {
    this.showImage = false;
    this.imagePreview = null;
    this.addDialog = true;
  };

  closeAddDialog = () => {
    this.addDialog = false;
  };

  onSubmit = () => {
    this.complaintForm.patchValue({
      farmerId: this.authService.getUserId(),
    });

    if (this.complaintForm.valid) {
      this.complaintService
        .addComplaint(this.complaintForm.value)
        .subscribe(() => {
          this.getComplaints();
          this.complaintForm.reset();
          this.addDialog = false;
        });
    } else {
      this.complaintForm.markAllAsTouched();
    }
  };

  onFileSelected(event: any) {
    this.emptyImage = false;
    this.file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };

    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      this.readFileAsBytes(file);
    }

    reader.readAsDataURL(this.file);
    this.showImage = true;
  }

  readFileAsBytes(file: File) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(result);
        const mimeType = file.type;
        const fileName = file.name;

        this.complaintForm.patchValue({
          filename: fileName,
          mimeType: mimeType,
          data: Array.from(bytes),
        });
      }
    };

    reader.readAsArrayBuffer(file);
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
  };
}
