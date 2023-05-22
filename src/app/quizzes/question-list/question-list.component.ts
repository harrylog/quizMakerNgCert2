import { AfterViewInit, ChangeDetectorRef, Component, ContentChildren, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizDataService } from '../services/quiz-data.service';
import { Question } from '../models/question.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { singleResult } from '../models/singleResult.model';
import { ResultsDataService } from '../services/results-data.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {


  questions: Question[] = []
  selectedButtonIndices: number[] = [];
  correctButtons: number[] = []
  inCorrectButtons: number[] = []
  correctAnswers: string[] = []
  constructor(public fb: FormBuilder,
    private quizDataservice: QuizDataService,
    private route: ActivatedRoute, private resDataService: ResultsDataService,
    private router: Router) { }

  finalReplys: singleResult[] = []
  ngOnInit(): void {
    this.route.data
      .subscribe(
        (data: Data) => {
          console.log(data)

          this.questions = data['questions'];
          data['questions'].map((qu) => {

            qu.allPossAns = [...qu['incorrect_answers'], qu['correct_answer']]
            qu.allPossAns = this.shuffleArray(qu.allPossAns)
            this.correctAnswers.push(qu['correct_answer'])
          });
        }
      );
  }

  selectChoice(qind, aind, answer) {
    let isCorrect = this.questions[qind]['correct_answer'] == answer
    console.log(isCorrect)
    isCorrect == true ? this.correctButtons[qind] = aind : this.inCorrectButtons[qind] = aind
    this.selectedButtonIndices[qind] = aind;
    // console.log('selected:')
    // console.log(this.selectedButtonIndices)
    // console.log('curr V')
    // console.log(this.correctButtons)
    // console.log('curr X')
    // console.log(this.inCorrectButtons)

  }

  isQuestionaireComplete() {
    return this.selectedButtonIndices.length == this.quizDataservice.selectedParams.amount
  }

  gatherDataForResult() {

    console.log('gatherDataForResult')

    // console.log(this.questions)

    this.resDataService.setQus(this.questions)
    this.resDataService.setSelectedRe(this.selectedButtonIndices)
    this.resDataService.setCorrectRes(this.correctButtons)
    this.resDataService.setInCorrectRe(this.inCorrectButtons)
    this.resDataService.setAllCorrectAns(this.correctAnswers)

    // console.log(this.resDataService.questions)
    this.router.navigate(['quizzes/results'])
  }

  shuffleArray(array: string[]): string[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
  }

}