import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { FarmingTipsService } from 'src/app/shared/services/farming-tips/farming-tips.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-farming-tips',
  templateUrl: './farming-tips.component.html',
  styleUrls: ['./farming-tips.component.scss'],
  providers: [MessageService],
})
export class FarmingTipsComponent {
  tipForm: FormGroup;

  tips: any = [];
  tipId: any;
  imagePreview: string | ArrayBuffer | null = null;
  file: any;

  addDialog = false;
  confirmationDialog = false;
  showImage = false;
  isEditing = false;
  emptyImage = false;
  search = '';
  empty = true;

  totalAds: number = 0;
  page: number = 0;

  constructor(
    private farmingTipsService: FarmingTipsService,
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.tipForm = fb.group({
      tip: ['', Validators.required],
      subject: ['', Validators.required],
      filename: [''],
      mimeType: [''],
      data: [''],
    });
  }

  get tip() {
    return this.tipForm.get('tip') as FormControl;
  }

  get subject() {
    return this.tipForm.get('subject') as FormControl;
  }

  ngOnInit(): void {
    this.getAllFarmingTips();
  }

  getAllFarmingTips = () => {
    this.farmingTipsService.getAllFarmingTips().subscribe(
      (data: any) => {
        this.tips = data.sort((a: any, b: any) => b.tipId - a.tipId);

        if (this.tips.length > 0) {
          this.empty = false;
        } else {
          this.empty = true;
        }
      },
      () => {
        this.authService.logout();
      }
    );
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

        this.tipForm.patchValue({
          filename: fileName,
          mimeType: mimeType,
          data: Array.from(bytes),
        });
      }
    };

    reader.readAsArrayBuffer(file);
  }

  openAddTipDialog = () => {
    this.isEditing = false;
    this.tipForm.reset();
    this.emptyImage = false;
    this.showImage = false;
    this.addDialog = true;
  };

  onEditTip = (tip: any) => {
    this.isEditing = true;
    this.tipForm.patchValue({
      tip: tip.tip,
      subject: tip.subject,
      filename: tip.filename,
      mimeType: tip.mimeType,
      data: tip.data,
    });
    this.imagePreview = tip.image;
    if (tip.image) {
      this.showImage = true;
    } else {
      this.showImage = false;
    }
    this.tipId = tip.tipId;
    this.addDialog = true;
  };

  onSubmit = () => {
    if (this.isEditing) {
      this.farmingTipsService
        .updateTip(this.tipId, this.tipForm.value)
        .subscribe(
          () => {
            this.getAllFarmingTips();
            this.tipForm.reset();
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
      if (this.tipForm.valid) {
        this.farmingTipsService.addTip(this.tipForm.value).subscribe(
          () => {
            this.getAllFarmingTips();
            this.tipForm.reset();
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
        this.tipForm.markAllAsTouched();
        this.emptyImage = true;
      }
    }
  };

  onRemove = (tip: any) => {
    this.tipId = tip.tipId;
    this.confirmationDialog = true;
  };

  closeAddDialog = () => {
    this.addDialog = false;
  };

  onCloseConfirmationDialog = () => {
    this.confirmationDialog = false;
  };

  onDelete = () => {
    this.farmingTipsService
      .updateTip(this.tipId, {
        status: false,
      })
      .subscribe(
        () => {
          this.getAllFarmingTips();
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

  onSearchChange = (search: string) => {
    if (search !== '') {
      this.tips = this.tips.filter(
        (tip: any) =>
          tip.tip.toLowerCase().includes(search.toLowerCase()) ||
          tip.subject.toLowerCase().includes(search.toLowerCase())
      );
      if (this.tips.length > 0) {
        this.empty = false;
      } else {
        this.empty = true;
      }
    } else {
      this.getAllFarmingTips();
    }
  };
}
