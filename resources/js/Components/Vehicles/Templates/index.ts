import ClassicLayout from './ClassicLayout';
import ShowcaseLayout from './ShowcaseLayout';
import SpecSheetLayout from './SpecSheetLayout';
import type { VehicleLayoutTemplate } from '@/types/vehicle';

export { ClassicLayout, ShowcaseLayout, SpecSheetLayout };

const templates: Record<VehicleLayoutTemplate, typeof ClassicLayout> = {
    classic: ClassicLayout,
    showcase: ShowcaseLayout,
    spec_sheet: SpecSheetLayout,
};

export function getTemplate(key?: VehicleLayoutTemplate) {
    return templates[key || 'classic'] || ClassicLayout;
}
