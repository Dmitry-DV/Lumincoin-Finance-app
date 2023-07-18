export class NavigationControl {
    static selectActiveNavigationItem (activeElementNavigation, activeCategoryNavigation) {
        const elementsNavigation = document.querySelectorAll('.nav-element_active');

        Array.from(elementsNavigation).forEach(item => {
            item.classList.remove('activated');
        });
        if (activeCategoryNavigation) {
            activeCategoryNavigation.classList.add('activated');
        }
        activeElementNavigation.classList.add('activated');
    }
}