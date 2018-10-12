import { newE2EPage } from '@stencil/core/dist/testing';

const html = '<blaze-alert open dismissible>test this!</blaze-alert>';

describe('alert', async () => {
  test('triggers onClose event', async () => {
    const page = await newE2EPage();
    await page.setContent(html);

    const alert = await page.find('blaze-alert');
    const closeButton = await page.find('button');
    const onClose = await alert.spyOnEvent('onClose');

    await closeButton.click();
    await page.waitForChanges();

    expect(onClose).toHaveReceivedEvent();
  });
});
