import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, map, Observable, of, shareReplay, startWith, Subject, switchMap, tap, throwError } from 'rxjs';
import { Product } from './product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private productsUrl = 'api/products';
  private http = inject(HttpClient); //esto es lo mismo q en el constructor
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

  private productRefreshSubject = new BehaviorSubject<string>('')
  private productSelectedSubject= new BehaviorSubject<number | undefined>(undefined);
  readonly productSelected$ = this.productSelectedSubject.asObservable();

  readonly productsList$ = this.productRefreshSubject.pipe(
    switchMap( ()=>
      this.getProductList() //utilizo el metodo q hice de forma procedural
    ),
    shareReplay(1), //hace q repita el ultimo valor emitido, evitando q cada vez q se subscriba no vuelva a consultar
  ); 



  readonly SingleProductSelected$ = this.productSelectedSubject.pipe(
    filter(Boolean), //esta funcion rretorna true cuando el valor existe
    //filter((value): value is number => value !== undefined),
    switchMap((id:number)=> this.getProductV2(id) ) //utilizo el metodo q hice de forma procedural
  )

  updateProductList(){
    this.productRefreshSubject.next('')
  }

  setProductSelected(id:number){
    this.productSelectedSubject.next(id);
  }

  getProductList():Observable<Product[]>{
    return this.http.get<Product[]>(this.productsUrl).pipe(
    //  tap((productList)=>console.log('products',productList)),
      catchError(err => { //esta vaina espera un observable
        //return of([])
        return this.handleError(err);
      })
    );
  }

/*   getProductFirstVersion(productId:number):Observable<Product>{
    return this.http.get<Product>(`${this.productsUrl}/${productId}`).pipe(
      catchError(err =>{
        return this.handleError(err);
      })
    );
  } */

  //Solucion cargando la responsabilidad en 1 solo servicio
  getProductV2(productId:number):Observable<Product>{
    return this.http.get<Product>(`${this.productsUrl}/${productId}`).pipe(
      switchMap((product:Product)=>{
        return this.getProductReviews(product)
      }),
      catchError(err =>{
        return this.handleError(err);
      })
    );
  }

  getProductReviews(product:Product):Observable<Product>{
    if(product.hasReviews)
      return this.reviewService.getReviewUrl(product.id).pipe(
         map(reviews => {
          product.reviews = reviews;
          return product;
        })    
      )
    
    return of(product);
  }

  private handleError(error:HttpErrorResponse):Observable<never>{
    //console.log('antes',error);
    const formattedMessage = this.errorService.formatError(error);
   // console.log('formated',formattedMessage)
    return throwError(()=>formattedMessage); //throwError retorna un observable
  }
}
