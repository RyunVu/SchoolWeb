import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { RuntimeConfig } from './app/services/runtime-config';
import { extendArray } from '../extend-array';

extendArray();

if (environment.production) {
  enableProdMode();
}

// Lấy cấu hình (link media...) từ Web.config của API trước khi khởi động ứng dụng
RuntimeConfig.load(environment.apiUrl).finally(() => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
