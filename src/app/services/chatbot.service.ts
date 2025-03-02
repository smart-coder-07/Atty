import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InputObj } from '../util/model';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getResponse(inputObj: InputObj): any {
    return this.http.post<{ response: string }>(
      'https://awesome-pilot-452418-n3.el.r.appspot.com/ask',
      inputObj
    );
  }

  formatBotMessage(content: string) {
    // Step 1: Handle bold text for headings: **Heading** becomes <h2>Heading</h2>
    let formattedContent = content.replace(
      /\*\*(.*?)\*\*/g,
      '<h2 class="text-xl font-semibold text-white">$1</h2>'
    );

    // Step 2: Handle code blocks (```` code block ```): Convert ```java ... ``` into <pre><code></code></pre>
    formattedContent = formattedContent.replace(
      /```(.*?)```/gs,
      (match, p1) => {
        return `<pre class="bg-gray-800 text-white p-4 rounded-lg"><code class="language-java">${p1}</code></pre>`;
      }
    );

    // Step 3: Handle inline code (`code`): Convert `code` into <code>code</code>
    formattedContent = formattedContent.replace(
      /`(.*?)`/g,
      '<code class="bg-gray-800 text-white p-1 rounded-sm">$1</code>'
    );

    // Step 4: Handle list items (* item): Convert * item into <ul><li>item</li></ul>
    formattedContent = formattedContent.replace(
      /^\*\s*(.*)$/gm,
      '<ul><li class="text-white">$1</li></ul>'
    );

    // Step 5: Handle unordered list wrapping (if multiple <li> are found, wrap them in <ul>)
    formattedContent = formattedContent.replace(
      /(<ul><li.*<\/li><\/ul>)/g,
      (match) => {
        return `<ul class="list-disc pl-5">${match}</ul>`;
      }
    );

    // Return the sanitized HTML content
    return this.sanitizer.bypassSecurityTrustHtml(formattedContent);
  }
}
