import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CourseService } from 'src/app/shared/services/course/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  courses: any = [];

  apiLoaded = false;
  empty = true;

  search = '';

  page: number = 0;
  totalAds: number = 0;

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCourses();

    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  getCourses = () => {
    this.courseService.getAllCourses().subscribe((data: any) => {
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
    });
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

  onSearchChange = (search: string) => {
    if (search !== '') {
      this.courses = this.courses.filter((course: any) =>
        course.courseName.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      this.getCourses();
    }
  };

  onPageChange = (page: any) => {
    this.page = page.page;
    this.getCourses();
  };

  onStateChange = (e: any) => {
    console.log(e);
  };
}
