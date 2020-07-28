import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-tours-page',
  templateUrl: './tours-page.component.html',
  styleUrls: ['./tours-page.component.css']
})
export class ToursPageComponent implements OnInit {
  id: any;
  imgUrl: any;
  author_id = localStorage.getItem('user_id');
  user_id = localStorage.getItem('user_id');

  comments:any = [];

  commentAuthor:any = [];

  constructor(private activateRoute: ActivatedRoute, private dataService: DataService){
      this.id = activateRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getPostById();
    this.getComment();
    this.getPostGids();
  }
  event:any = [];

  getPostById(){
    this.dataService.getPostById(this.id).subscribe(res=>{
      console.log(res);
      this.event = res[0];
      this.imgUrl = res[1];
      this.event = this.event[0];
    })
  }

  getComment(){
    this.dataService.getComment(this.id).subscribe(res=>{
      // console.log(res);
      this.comments = res;
      for(let i=0; i<this.comments.length; i++){
        this.dataService.getCommentAuthor(this.comments[i].author_id).subscribe(response=>{
          this.commentAuthor[i] = response;
        })
      }

    });
  }
  addComment(form: NgForm){
    if(!this.user_id){
      alert('Ви не увійшли в аккаунт');
    } else {
    this.dataService.addComment(this.author_id, this.id, form.value.content)
      .subscribe(
        response =>{
          this.getComment();
        },
        error => console.log(error)
      )
    }
  }
  data:any;
  postGids:any = [];
  getPostGids(){
    this.dataService.getPostGids(this.id)
      .subscribe(
        response =>{
          this.data = response;
          for(let i = 0; i < this.data.length; i++){
            this.dataService.getGid(this.data[i].gid_id).subscribe(res => {
              this.postGids[i] = res;
            });
          }
          console.log(this.postGids);
        },
        error => console.log(error)
      )
  }
}

