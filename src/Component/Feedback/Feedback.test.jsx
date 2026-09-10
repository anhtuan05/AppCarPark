import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';
import i18n from '../../i18n';
import Feedback from './index';

describe('Feedback form', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('vi');
  });

  it('submits a valid support request and offers a clean restart', async () => {
    const user = userEvent.setup();
    render(<Feedback />);

    await user.type(screen.getByLabelText(new RegExp(i18n.t('feedback.subject'))), 'Không mở được barie');
    await user.type(screen.getByLabelText(new RegExp(i18n.t('feedback.message'))), 'Tôi cần hỗ trợ kiểm tra lượt ra khỏi bãi.');
    await user.click(screen.getByRole('button', { name: i18n.t('feedback.send') }));

    expect(screen.getByRole('heading', { name: i18n.t('feedback.successTitle') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('feedback.submitAnother') })).toBeInTheDocument();
  });
});
