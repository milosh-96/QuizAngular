import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getQueryValue } from '@angular/core/src/view/query';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Linkster';
  user: User = new User("Miloš");
  questions: Question[];
  displayQuestion:Question;
  currentQuestionIndex:number;
  trueCorrect:string;

  ngOnInit() {
    this.getData();
  }
  reload(choice) {


    if(choice == this.displayQuestion.correct_answer) {
      this.user.points += 5;
      this.trueCorrect = "TAČAN ODGOVOR!";
    }
    else {
      this.user.points += -10;
      this.trueCorrect = "POGREŠAN ODGOVOR!";

    }

    setTimeout(()=>{
      this.trueCorrect = "";

    },5000);
    this.questions.splice(this.currentQuestionIndex,1);
    if(this.questions.length < 1) {
      this.gameEnded();
    }
    this.getQuestion();
  }

  getQuestion() {
    this.currentQuestionIndex = Math.floor(Math.random() * this.questions.length);
    this.displayQuestion = this.questions[this.currentQuestionIndex];
    this.displayQuestion.choices = this.displayQuestion.incorrect_answers;
    this.displayQuestion.choices.push(this.displayQuestion.correct_answer);
    this.displayQuestion.choices.sort(() => Math.random() - 0.5);
  }

  getData() {
    this.http.get("https://opentdb.com/api.php?amount=10&type=multiple").subscribe((data)=>{
     if(data) {
      //@ts-ignore
      this.questions = data.results; // JSON response object, that's why I want ignore on this
     }
     this.getQuestion();
    });

  }

  gameEnded() {
    alert("KRAJ!");
  }
  constructor(private http:HttpClient) {

  }
}


class Question {
  public question;
  public correct_answer;
  public incorrect_answers;
  public choices : string[];
}

class User {
  public name: string;
  public points: number = 0;
  public correct_answers: number;
  public incorrect_answers: number;

  constructor(name) {
    this.name = name;
  }
}
