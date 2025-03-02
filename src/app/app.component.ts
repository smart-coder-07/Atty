import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  bootstrapRobot,
  bootstrapArrowUp,
  bootstrapStopCircleFill,
} from '@ng-icons/bootstrap-icons';
import { InputObj } from './util/model';
import { ChatbotService } from './services/chatbot.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [FormsModule, NgFor, NgIf, NgIcon],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  viewProviders: [
    provideIcons({ bootstrapRobot, bootstrapArrowUp, bootstrapStopCircleFill }),
  ],
})
export class AppComponent {
  constructor(
    private service: ChatbotService,
    private sanitizer: DomSanitizer
  ) {}
  inputObj: InputObj = {
    question: '',
  };
  dummy: string = '';
  response: string = '';
  isLoading: boolean = false;
  messages: { content: string; role: string }[] = [];

  formatBotMessage(content: string): SafeHtml {
    return this.service.formatBotMessage(content);
  }

  sendMessage() {
    if (this.dummy.trim() === '') return;
    this.isLoading = true;
    this.inputObj.question = this.dummy;
    this.dummy = '';
    this.messages.push({
      content: this.inputObj.question,
      role: 'user',
    });

    this.service.getResponse(this.inputObj).subscribe(
      (res: any) => {
        this.messages.push({
          content: res.response,
          role: 'bot',
        });
        this.isLoading = false;
        console.log(res.response);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
