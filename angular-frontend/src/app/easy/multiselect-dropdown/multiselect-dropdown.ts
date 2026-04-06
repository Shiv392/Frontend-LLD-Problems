import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnChanges, SimpleChange, SimpleChanges, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-multiselect-dropdown',
  imports: [CommonModule, FormsModule],
  templateUrl: './multiselect-dropdown.html',
  styleUrl: './multiselect-dropdown.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectDropdown),
      multi: true
    }
  ],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class MultiselectDropdown implements ControlValueAccessor, OnChanges {

  private element_ref = inject(ElementRef);

  @Input() options: any[] = [];
  @Input() bind_label: string = 'label';
  @Input() bind_value: string = 'value';
  @Input() placeholder: string = 'Select...';
  @Input() multiple: boolean = false;

  @HostListener('document:click', ['$event'])
  handle_click_outside(event : any){
    if(!this.element_ref.nativeElement.contains(event.target)){
      this.filered_options = [...this.options];
      this.is_open = false;
    }
  }

  public value: any = this.multiple ? [] : null; //dropdown selected value
  public is_open: boolean = false;

  public filered_options : any[] = [];
  public search_key : string = '';

  public debounce_timer : any;

  ngOnChanges(changes : SimpleChanges): void {
    if(changes['options']) {
      this.filered_options = this.options;
    }
  }

  onChange = (_: any) => { };
  onTouched = () => { }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public toggle_dropdown(): void {
    this.search_key = '';
    this.is_open = !this.is_open;
  }

  public dropdown_blur() : void{
    console.log('blurred');
  }

  public select_item(item: any): void {
    const val = item[this.bind_value];
    if (this.multiple) {
      const exists = this.value?.includes(val);
      if (exists) {
        this.value = this.value.filter((v: any) => v != val);
      }
      else {
        this.value = [...(this.value || []), val];
      }
    }
    else {
      this.value = val;
      this.filered_options = [...this.options];
      this.is_open = false;
    }

    this.onChange(this.value);
    this.onTouched();
  }

  public is_selected(option: any): boolean {
    const value = option[this.bind_value];
    return this.multiple ? this.value?.includes(value) : this.value == value;
  }

  public filter(event : any) : void{
     const value = event.target.value;
    if(this.debounce_timer){
      clearTimeout(this.debounce_timer);
    }


  this.debounce_timer = setTimeout(()=>{
    this.apply_filter(value);
  }, 300)
  }

  public apply_filter(search : string) : void{
    const search_key = search?.toLowerCase().trim();
    console.log('search-------->', search);
    if(search_key == '' || !search_key){
      this.filered_options = [...this.options];
      return;
    }

    this.filered_options = this.options.filter(option=>{
      const label = option[this.bind_label].toLowerCase();
      return label.startsWith(search_key);
    })
  }
}
