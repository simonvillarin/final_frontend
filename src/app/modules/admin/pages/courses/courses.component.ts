import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CourseService } from 'src/app/shared/services/course/course.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  providers: [MessageService],
})
export class CoursesComponent implements OnInit {
  courseForm: FormGroup;
  courses: any = [];
  stats: any = ['Activate', 'Inactive'];
  course: any = {};
  courseId: any;

  confirmationDialog = false;
  addDialog = false;
  isEditing = false;
  empty = true;

  page: number = 0;
  totalAds: number = 0;

  statusSelected = '';

  constructor(
    private courseService: CourseService,
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.courseForm = fb.group({
      courseName: ['', Validators.required],
      description: ['', Validators.required],
      ytLink: ['', Validators.required],
    });
  }

  get courseName() {
    return this.courseForm.get('courseName');
  }

  get description() {
    return this.courseForm.get('description');
  }

  get ytLink() {
    return this.courseForm.get('ytLink');
  }

  ngOnInit(): void {
    this.getAllCourses();
  }

  getAllCourses = () => {
    this.courseService.getAllCourses().subscribe(
      (data: any) => {
        let tempCourses = data.sort(
          (a: any, b: any) => b.courseId - a.courseId
        );
        this.totalAds = tempCourses.length;
        this.courses = tempCourses.splice(this.page * 5, 5);

        if (this.courses.length > 0) {
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

  onPageChange = (page: any) => {
    this.page = page.page;
    this.getAllCourses();
  };

  onStatusChange = (status: string) => {
    if (status !== '') {
      if (status === 'Active') {
        this.courses = this.courses.filter(
          (course: any) => course.status === true
        );
      } else {
        this.courses = this.courses.filter(
          (course: any) => course.status === true
        );
      }
    } else {
      this.getAllCourses();
    }
  };

  onClear = () => {
    this.statusSelected = '';
    this.getAllCourses();
  };

  openAddCourseDialog = () => {
    this.isEditing = false;
    this.courseForm.reset();
    this.addDialog = true;
  };

  onEditCourse = (course: any) => {
    this.isEditing = true;
    this.courseForm.patchValue({
      courseName: course.courseName,
      description: course.description,
      ytLink: course.ytLink,
    });
    this.course = course;
    this.addDialog = true;
  };

  closeAddDialog = () => {
    this.addDialog = false;
  };

  onRemove = (course: any) => {
    this.confirmationDialog = true;
    this.course = course;
  };

  onCloseConfirmationDialog = () => {
    this.confirmationDialog = false;
  };

  onSubmit = () => {
    if (this.isEditing) {
      if (this.courseForm.valid) {
        this.courseService
          .updateCourse(this.course.courseId, this.courseForm.value)
          .subscribe(
            () => {
              const course = this.courses.find(
                (course: any) => course.courseId === this.course.courseId
              );
              const index = this.courses.indexOf(course);
              this.courses[index].courseName =
                this.courseForm.get('courseName')?.value;
              this.courses[index].description =
                this.courseForm.get('description')?.value;
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
        this.courseForm.markAllAsTouched();
      }
    } else {
      if (this.courseForm.valid) {
        this.courseService.addCourse(this.courseForm.value).subscribe(
          () => {
            this.courses.push(this.courseForm.value);
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
        this.courseForm.markAllAsTouched();
      }
    }
  };

  onDelete = () => {
    const payload = {
      status: !this.course.status,
    };
    this.courseService.updateCourse(this.course.courseId, payload).subscribe(
      () => {
        const course = this.courses.find(
          (course: any) => course.courseId === this.course.courseId
        );
        const index = this.courses.indexOf(course);
        this.courses[index].status = !this.course.status;
        this.confirmationDialog = false;
        const summary = !this.course.status ? 'Deactivated' : 'Activated';
        const details = !this.course.status
          ? 'Deactivated Successfully'
          : 'Activated Sucessfully';
        this.messageService.add({
          severity: 'success',
          summary: summary,
          detail: details,
        });
      },
      () => {
        this.authService.logout();
      }
    );
  };

  getYoutubeVideoUrl = (url: string) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    const match = url.match(regExp);

    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  };

  getYoutubeVideoId = (url: string) => {
    return this.getYoutubeVideoUrl(url) || null;
  };

  onStateChange = (e: any) => {
    console.log(e);
  };
}
