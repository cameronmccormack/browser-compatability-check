// TODO: check this type works will all branches of the getItemType method
export type ItemType = {
  [feature: string]: {
    __compat: {
      support: {
        [browser: string]: SupportBrowser | SupportBrowser[];
      };
    };
  };
};

type SupportBrowser = {
  version_added: string;
  flags: string[];
};
