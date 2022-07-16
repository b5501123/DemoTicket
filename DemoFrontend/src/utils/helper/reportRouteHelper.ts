import { computed, ComputedRef, reactive, readonly } from 'vue';

export type ReportRoute = Array<string>;

interface IUseRouteState {
  myRoute: Readonly<ReportRoute>;
  showMe: ComputedRef<boolean>;
}

export interface INavSystem {
  append: (val: string, name?: string) => void;
  back: () => void;
  checkEqual: (checkRoute: any) => boolean;
  goLevel: (level: number) => void;
  useRouteState: (myNode: string, parentRoute: ReportRoute) => IUseRouteState;
}

export class NavSystem {
  private pathRoute: ReportRoute = [];
  private breadcrumbs: ReportRoute = [];

  constructor(_pathRoute, _breadcrumbs) {
    this.pathRoute = reactive<ReportRoute>(Array.from(_pathRoute));
    this.breadcrumbs = _breadcrumbs;
  }

  public append(val: string, name?: string) {
    name = name || val;
    this.breadcrumbs.push(name);
    this.pathRoute.push(val);
  }

  public back() {
    const targetLevel = Math.max(this.pathRoute.length - 2, 0);
    this.goLevel(targetLevel);
  }

  public checkEqual(checkRoute) {
    let rt = false;
    if (checkRoute.length == this.pathRoute.length) {
      rt = this.pathRoute.reduce((acc, curr, idx) => {
        return curr == checkRoute[idx] && acc;
      }, true);
    }
    return rt;
  }

  public goLevel(level: number) {
    if (level < this.pathRoute.length) {
      this.breadcrumbs.splice(level + 1, 10000);
      this.pathRoute.splice(level + 1, 10000);
    }
  }

  public useRouteState(myNode: string, parentRoute: ReportRoute): IUseRouteState {
    const myRoute = readonly<ReportRoute>(parentRoute.concat(myNode));
    const showMe = computed(() => this.checkEqual(myRoute));
    return { myRoute, showMe };
  }
}
