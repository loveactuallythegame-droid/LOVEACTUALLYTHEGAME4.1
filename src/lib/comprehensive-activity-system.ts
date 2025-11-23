export type ActivityTemplate = {
  id: string;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  categoryId?: string;
  subcategoryId?: string;
  type?: string;
  tags: string[];
  drMarcieIntro?: string;
  pointValue?: number;
};

export type ActivitySubcategory = {
  id: string;
  name: string;
  description?: string;
  difficulty?: number;
  estimatedTime?: number;
  activities: ActivityTemplate[];
};

export type ActivityCategory = {
  id: string;
  name: string;
  description?: string;
  color?: string;
  subcategories: ActivitySubcategory[];
};

export const COMPREHENSIVE_ACTIVITY_SYSTEM: any[] = [];

export class ComprehensiveActivityManager {
  constructor(private activities: ActivityTemplate[] = []) {}

  list(): ActivityTemplate[] {
    return this.activities;
  }

  findById(id: string): ActivityTemplate | undefined {
    return this.activities.find(a => a.id === id);
  }

  add(activity: ActivityTemplate) {
    this.activities.push(activity);
  }

  // Static helpers to match usage in the app
  static getCategoryById(id: string) {
    return COMPREHENSIVE_ACTIVITY_SYSTEM.find((c: any) => c.id === id);
  }

  static getSubcategoryById(categoryId: string, subId: string) {
    const category = ComprehensiveActivityManager.getCategoryById(categoryId);
    return category?.subcategories?.find((s: any) => s.id === subId);
  }
}
