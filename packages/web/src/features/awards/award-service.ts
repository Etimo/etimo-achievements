import { useAppDispatch } from '../../app/store';
import { AwardApi } from './award-api';
import { deleteAward, setAwards, updateAward } from './award-slice';

export class AwardService {
  private dispatch = useAppDispatch();
  private api = new AwardApi();

  public async load() {
    const response = await this.api.getMany().wait();
    if (response.success) {
      const awards = (await response.data()).data;
      const userIds = awards.map((a) => a.userId);
      const achievementIds = awards.map((a) => a.achievementId);
      console.log(userIds);
      console.log(achievementIds);
      this.dispatch(setAwards(awards));
    }
  }

  public async get(id: string) {
    const response = await this.api.get(id).wait();
    if (response.success) {
      const award = await response.data();
      this.dispatch(updateAward(award));
      return award;
    }
  }

  public async delete(id: string) {
    const response = await this.api.delete(id).wait();
    if (response.success) {
      this.dispatch(deleteAward(id));
      return true;
    }
    return false;
  }
}
