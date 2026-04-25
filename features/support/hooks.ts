import { After, Before, Status } from '@cucumber/cucumber';
import type { ITestCaseHookParameter } from '@cucumber/cucumber';
import type { PWWorld } from './world';

Before(async function (this: PWWorld) {
  await this.init();
});

After(async function (this: PWWorld, scenario: ITestCaseHookParameter) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
  }

  await this.cleanup();
});
