import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

interface NavItem {
  name: string;
  icon: string;
  route: string;
  isActive: () => boolean;
}


export const useNavItems = () => {
  const route = useRoute();
  const router = useRouter();

  const navItems: NavItem[] = [
    {
      icon: "mdi-home",
      name: "home",
      route: "/",
      isActive: () => route.path === "/",
    },
    {
      icon: "mdi-magnify",
      name: "search",
      route: "/search",
      isActive: () => route.path === "/search",
    },
    {
      icon: "mdi-bookmark",
      name: "saves",
      route: "/saves",
      isActive: () => route.path === "/saves",
    },
  ];

  const currentNavIndex = computed(() => {
    return navItems.findIndex((item) => item.isActive());
  });

  const navigateTo = (index: number) => {
    router.push(navItems[index].route);
  };

  return { navItems, currentNavIndex, navigateTo };
};
