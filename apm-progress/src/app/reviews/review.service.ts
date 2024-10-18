import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Review } from './review';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpErrorService } from '../utilities/http-error.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  // Just enough here for the code to compile
  private reviewsUrl = 'api/reviews';
  private http = inject(HttpClient); //esto es lo mismo q en el constructor
  private errorService = inject(HttpErrorService);
  
  getReviewUrl(productId: number):Observable<Review[]> {
    // Use appropriate regular expression syntax to
    //return this.reviewsUrl + '?productId=^' + productId + '$';
    return this.http.get<Review[]>( this.reviewsUrl + '?productId=^' + productId + '$').pipe(
      catchError(err =>{
        return this.handleError(err);
      })
    );
  }

  private handleError(error:HttpErrorResponse):Observable<never>{
    //console.log('antes',error);
    const formattedMessage = this.errorService.formatError(error);
   // console.log('formated',formattedMessage)
    return throwError(()=>formattedMessage);
  }
}
