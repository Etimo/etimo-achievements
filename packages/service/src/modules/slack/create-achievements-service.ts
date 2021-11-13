import { CreateAchievementModal } from './modals/create-achievement-modal-open';
import { openSlackView } from './utils';

export class CreateSlackAchievementsService {
  public async getModal(triggerId: string) {
    const createAchievementModal = CreateAchievementModal;
    createAchievementModal.trigger_id = triggerId;

    const jsonModal = JSON.stringify(createAchievementModal);

    await openSlackView(jsonModal);
  }
}
