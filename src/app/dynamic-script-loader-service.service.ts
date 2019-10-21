import { Injectable } from '@angular/core';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'jq', src: 'assets/js/jquery-2.1.1.js'},
  { name: 'bootstrap', src: 'assets/js/bootstrap.min.js'},
  { name: 'metis', src: 'assets/js/plugins/metisMenu/jquery.metisMenu.js'},
  { name: 'slim', src: 'assets/js/plugins/slimscroll/jquery.slimscroll.min.js'},
  { name: 'inspinia', src: 'assets/js/inspinia.js'},
  { name: 'pace', src: 'assets/js/plugins/pace/pace.min.js'},
  { name: 'datePicker', src: 'assets/js/plugins/datapicker/bootstrap-datepicker.js' },
  {name: 'moment', src: 'assets/js/plugins/fullcalendar/moment.min.js'},
  { name: 'clockPicker', src: 'assets/js/plugins/clockpicker/clockpicker.js' },
  { name: 'dateRange', src: 'assets/js/plugins/daterangepicker/daterangepicker.js'},
  { name: 'footable', src: 'assets/js/plugins/footable/footable.all.min.js' },
  { name: 'loadDatePicker', src: 'assets/js/datepicker.js' },
  { name: 'loadFootable', src: 'assets/js/loadfootable.js' }
];

declare var document: any;

@Injectable({
  providedIn: 'root'
})
export class DynamicScriptLoaderServiceService {

  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(...scripts: string[] ) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  unload(...scripts: string[] ) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.unloadScript(script)));
    return Promise.all(promises);
  }

  unloadScript(id: string) {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id) != null) {
        document.getElementById(id).remove();
        console.log(id);
        resolve(true);
      } else {
        resolve(true);
      }
    });
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.async = true;
        script.charset = 'utf-8';
        script.id = name;
        if (script.readyState) {
          script.onreadystatechange = () => {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({script: name, loaded: true, status: 'Loaded'});
            }
          };
        } else {
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({script: name, loaded: true, status: 'Loaded'});
          };
        }
        script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        resolve({ script: name, loaded: true, status: 'Already Loaded'});
      }
    });
  }
}
