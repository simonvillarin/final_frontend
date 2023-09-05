import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ComplaintsService } from 'src/app/shared/services/complaints/complaints.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss'],
  providers: [MessageService],
})
export class ComplaintsComponent {
  complaintForm: FormGroup;
  complaints: any = [];
  complaint: any = {};
  complaintTypes: any = ['Dispute', 'Service', 'Website Issue'];

  addDialog = false;
  confirmationDialog = false;
  showImage = false;
  isEditing = false;
  emptyImage = false;
  imagePreview: string | ArrayBuffer | null = null;
  file: any;

  categorySelected = '';

  constructor(
    private complaintService: ComplaintsService,
    private authService: AuthService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.complaintForm = fb.group({
      farmerId: ['', Validators.required],
      complaintType: ['', Validators.required],
      complaintDetails: ['', Validators.required],
      filename: [''],
      mimeType: [''],
      data: [''],
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
      });
  };

  onCategoryChange = (category: string) => {
    if (this.categorySelected !== '') {
      this.complaintService
        .getAllComplaintsByFarmerId(this.authService.getUserId())
        .subscribe((data: any) => {
          this.complaints = data.sort(
            (a: any, b: any) => b.complaintId - a.complaintId
          );
          this.complaints = this.complaints.filter(
            (complaint: any) => complaint.complaintType === category
          );
        });
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

  onClear = () => {
    this.categorySelected = '';
    this.getComplaints();
  };

  openAddDialog = () => {
    this.isEditing = false;
    this.showImage = false;
    this.imagePreview = null;
    this.complaintForm.reset();
    this.addDialog = true;
  };

  closeAddDialog = () => {
    this.addDialog = false;
  };

  onRemove = (complaint: any) => {
    this.complaint = complaint;
    this.confirmationDialog = true;
  };

  onEdit = (complaint: any) => {
    this.isEditing = true;
    this.complaint = complaint;
    this.complaintForm.patchValue({
      complaintType: complaint.complaintType,
      complaintDetails: complaint.complaintDetails,
    });
    this.imagePreview = complaint.image;
    if (complaint.image) {
      this.showImage = true;
    } else {
      this.showImage = false;
    }

    this.addDialog = true;
  };

  onSubmit = () => {
    this.complaintForm.patchValue({
      farmerId: this.authService.getUserId(),
    });

    if (this.isEditing) {
      if (this.complaintForm.valid) {
        this.complaintService
          .updateComplaint(this.complaint.complaintId, this.complaintForm.value)
          .subscribe(
            () => {
              this.getComplaints();
              this.addDialog = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Updated',
                detail: 'Updated Successfully',
              });
            },
            () => {
              this.authService.logout();
            }
          );
      } else {
        this.complaintForm.markAllAsTouched();
      }
    } else {
      if (this.complaintForm.valid) {
        this.complaintService.addComplaint(this.complaintForm.value).subscribe(
          () => {
            this.getComplaints();
            this.complaintForm.reset();
            this.addDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Added',
              detail: 'Added Successfully',
            });
          },
          () => {
            this.authService.logout();
          }
        );
      } else {
        this.complaintForm.markAllAsTouched();
      }
    }
  };

  onDelete = () => {
    const payload = {
      isDeleted: !this.complaint.isDeleted,
    };
    console.log(this.complaint);

    this.complaintService
      .updateComplaint(this.complaint.complaintId, payload)
      .subscribe(
        () => {
          this.getComplaints();
          this.confirmationDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Deleted Successfully',
          });
        },
        () => {
          this.authService.logout();
        }
      );
  };

  onCloseConfirmationDialog = () => {
    this.confirmationDialog = false;
  };
}
