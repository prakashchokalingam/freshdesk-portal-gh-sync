const TRIGGER_FD_GH_SYNC_APP = 'TRIGGER_FD_GH_SYNC_APP';

const INTERNAL_APIS = {
 ACCOUNT: '/api/_/bootstrap/account',
 PORTAL: (portalId: string) => `/api/_/portals/${portalId}`,
 THEME: (themeId: string) => `/api/_/portal-templates/${themeId}`,
 PAGES: (themeId: string, page: string) => `/api/_/portal-templates/${themeId}/pages/${page}`,
};

const THEME_OBJ_EXCLUDABLES = ['content_type', 'created_at', 'custom_css', 'footer', 'head', 'header', 'id', 'is_active', 'layout', 'name', 'portal_id', 'reference', 'reference_type', 'updated_at'];
const LAYOUTS = ['custom_css', 'layout', 'head', 'header', 'footer'];
const PAGES = [
  'portal_home',
  'user_login',
  'user_signup',
  'search',
  'solution_home',
  'solution_category',
  'article_list',
  'article_view',
  'discussions_home',
  'discussions_category',
  'topic_list',
  'my_topics',
  'topic_view',
  'new_topic',
  'submit_ticket',
  'ticket_list',
  'ticket_view',
  'archive_ticket_list',
  'archive_ticket_view',
  'public_ticket_view',
  'archive_public_ticket_view'
];

export {
  TRIGGER_FD_GH_SYNC_APP,
  INTERNAL_APIS,
  THEME_OBJ_EXCLUDABLES,
  LAYOUTS,
  PAGES,
}