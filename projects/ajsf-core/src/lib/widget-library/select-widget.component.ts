import {
  Component, ComponentFactoryResolver, ComponentRef, Input,
  OnChanges, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';

import { JsonSchemaFormService } from '../json-schema-form.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-widget-widget',
  template: `<div #widgetContainer></div>`,
})
export class SelectWidgetComponent implements OnChanges, OnInit {
  newComponent: ComponentRef<any> = null;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];
  @ViewChild('widgetContainer', { read: ViewContainerRef, static: true })
    widgetContainer: ViewContainerRef;

  constructor(
    private componentFactory: ComponentFactoryResolver,
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.updateComponent();
  }

  ngOnChanges() {
    this.updateComponent();
  }

  updateComponent() {
    if (this.widgetContainer && !this.newComponent && (this.layoutNode || {}).widget) {
      this.newComponent = this.widgetContainer.createComponent(
        this.componentFactory.resolveComponentFactory(this.layoutNode.widget)
      );
    }
    if (this.newComponent) {
      for (const input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
        if (this.newComponent.instance && this.newComponent.instance.options && !!this.newComponent.instance.options.disabled){ // && typeof this.newComponent.instance.setDisabled !== "undefined") {
          //this.newComponent.instance.setDisabled();
          this.newComponent.instance.controlDisabled = !!this.newComponent.instance.options.disabled;
          this.newComponent.instance.formControl.disable();
        }
        else {
          this.newComponent.instance.controlDisabled = false;
          if (this.newComponent.instance.formControl) {
            this.newComponent.instance.formControl.enable();
          }
        }
        this.newComponent.instance[input] = this[input];
      }
    }
  }
}
