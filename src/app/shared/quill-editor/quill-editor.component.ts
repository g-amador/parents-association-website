import { Component, ElementRef, forwardRef, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';

@Component({
  selector: 'app-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillEditorComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class QuillEditorComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('editor') editorElement?: ElementRef;

  private quill: Quill | undefined;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  ngAfterViewInit() {
    if (this.editorElement) {
      console.log('Quill Editor Element:', this.editorElement.nativeElement);

      this.quill = new Quill(this.editorElement.nativeElement, {
        theme: 'snow',
        placeholder: 'Write something...',
      });

      this.quill.on('text-change', () => {
        const editorContent = this.quill!.root.innerHTML;
        this.onChange(editorContent);
        this.onTouched();
      });
    }
  }

  ngOnDestroy() {
    if (this.quill) {
      this.quill.off('text-change', () => {}); // Provide an empty function as the second argument
    }
  }

  writeValue(content: string): void {
    if (this.quill) {
      this.quill.root.innerHTML = content;
    } else {
      // If Quill is not initialized yet, set the content when it's ready
      setTimeout(() => {
        if (this.quill) {
          this.quill.root.innerHTML = content;
        }
      }, 0);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.quill) {
      this.quill.enable(!isDisabled);
    }
  }
}
