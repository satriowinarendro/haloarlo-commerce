import config from "../../config.json";

type Config = {
  readonly base_url: string;
  readonly site_title: string;
  readonly site_description: string;
  readonly site_keywords: { keyword: string }[];
  readonly products_per_page: number;
  readonly instagram_account: string;
  readonly shopee_account: string;
  readonly whatsapp_link: string;
};

export default config as Config;
