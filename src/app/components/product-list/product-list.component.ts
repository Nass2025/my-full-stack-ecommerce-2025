import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../common/product';
import {ActivatedRoute} from '@angular/router';
import {CartItem} from '../../common/cart-item';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{

  message: string = "my message";
  products : Product[]=[];
  currentCategoryId:number = 1;
   previousCategoryId: number = 1;

  searchMode:boolean= false;
  pageNumber: number = 1;
  pageSize: number = 5;
  // @ts-ignore
  totalElements: number;
  // @ts-ignore
  previousSearchKeyword: string ;

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService:CartService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    })
  }

   listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    if (this.searchMode)
      this.handleSearchProducts();
    else
      this.handleListProducts();
  }

  private handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");
    if (hasCategoryId)
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!;
    if (this.previousCategoryId != this.currentCategoryId)
      this.pageNumber=1;
    this.previousCategoryId = this.currentCategoryId;
    this.productService.getProductListPaginate(
      this.pageNumber -1,
            this.pageSize,
          this.currentCategoryId)
      .subscribe( this.processResult());
  }

  private handleSearchProducts() {
    // @ts-ignore
    const currentSearchKeyword : string = this.route.snapshot.paramMap.get("keyword");
    if (this.previousSearchKeyword != currentSearchKeyword)
      this.pageNumber = 1;
    this.previousSearchKeyword = currentSearchKeyword;
    this.productService.searchProductsPaginate(this.pageNumber -1,
                                                     this.pageSize ,
                                                      currentSearchKeyword).subscribe(this.processResult());

  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }


  addToCart(product: Product) {

    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);

  }

  private processResult() {
    return (data:any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }
}
