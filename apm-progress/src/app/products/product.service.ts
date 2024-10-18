import {  inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, filter, map, Observable, of, shareReplay, startWith, Subject, switchMap, tap, throwError } from 'rxjs';
import { Product, Result } from './product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private productsUrl = 'api/products';
  private http = inject(HttpClient); //esto es lo mismo q en el constructor
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

  private productRefreshSubject = new BehaviorSubject<string>('')
  readonly productSelectedIdS = signal<number | undefined>(undefined);

  // forma declarativa
  readonly productsListResult$ = this.productRefreshSubject.pipe(
    switchMap( ()=>
      this.getProductList() //utilizo el metodo q hice de forma procedural
    ),
    shareReplay(1), //hace q repita el ultimo valor emitido, evitando q cada vez q se subscriba no vuelva a consultar
  ); 

  //ya estoy capturando el error en el observable por loq esto no es necesario solo es otra forma de capturar un error:
/*   productListResultS = computed(()=>{
    try {
      return toSignal(this.productsListResult$,{initialValue:[] as Result<Product[]>})()
    } catch (error) {
      return [] as Product[]
    }
  });  */

  productListResultS =  toSignal(this.productsListResult$,{initialValue:[] as Result<Product[]>}); 
  
  
 /*  readonly SingleProductSelected$ = this.productSelectedSubject.pipe(
    filter(Boolean), //esta funcion rretorna true cuando el valor existe
    //filter((value): value is number => value !== undefined),
    switchMap((id:number)=> this.getProductV2(id) ) //utilizo el metodo q hice de forma procedural
  ) */

  //Reemplazo el subject por Signal
  private singleProductResult$ = toObservable(this.productSelectedIdS).pipe(
    filter(Boolean), //esta funcion rretorna true cuando el valor existe
    switchMap((id:number)=> this.getProductV2(id) ) //utilizo el metodo q hice de forma procedural
  )

  singleProductResultS = toSignal(this.singleProductResult$)

  updateProductList(){
    this.productRefreshSubject.next('')
  }

  setProductSelected(id:number){
   // this.productSelectedSubject.next(id);
   this.productSelectedIdS.set(id);
  }

  getProductList():Observable<Result<Product[]>>{
    return this.http.get<Product[]>(this.productsUrl).pipe(
      map(p=>({data:p} as Result<Product[]>)),
    //  tap((productList)=>console.log('products',productList)),
      catchError(err => { //esta vaina espera un observable
        return  of({error: this.errorService.formatError(err)})
      })
    );
  }

  //Solucion cargando la responsabilidad en 1 solo servicio
  getProductV2(productId:number):Observable<Result<Product>>{
    return this.http.get<Product>(`${this.productsUrl}/${productId}`).pipe(
      switchMap((product:Product)=>{
        return this.getProductReviews(product).pipe(map(val =>({data:val} as Result<Product>))) 
      }),
      catchError(err =>{
        return of({error:this.errorService.formatError(err)})
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

}
