import {
  alert,
  avatar,
  badge,
  breadcrumb,
  button,
  card,
  cardGrid,
  checkbox,
  code,
  codeBlock,
  confirmButton,
  definitionList,
  dropdown,
  dropdownScript,
  each,
  emptyState,
  fieldRow,
  form,
  icon,
  iconButton,
  iconNames,
  input,
  modal,
  modalScript,
  progress,
  radioGroup,
  renderAppLayout,
  row,
  rowList,
  searchInput,
  sectionHeader,
  segmented,
  select,
  skeleton,
  stat,
  status,
  table,
  textarea,
  timeline,
  tones,
  type NavItem,
  type Tone,
} from '../ds'

const NAV: NavItem[] = [
  { key: 'foundations', label: 'Foundations', href: '/', icon: 'sparkles' },
  { key: 'components', label: 'Components', href: '/components', icon: 'server' },
  { key: 'patterns', label: 'Patterns', href: '/patterns', icon: 'users' },
  { key: 'icons', label: 'Icons', href: '/icons', icon: 'search' },
]

const TONES: Tone[] = ['primary', 'secondary', 'info', 'danger', 'warning', 'accent', 'muted']

/** Labelled demo block — every example on the page sits in one. */
function demo(title: string, body: string, note?: string): string {
  return /* html */ `
    <section class="mb-8">
      <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-1">${title}</h3>
      ${note ? `<p class="text-xs text-gray-500 mb-3">${note}</p>` : '<div class="mb-3"></div>'}
      <div class="bg-white/5 border border-white/10 rounded-2xl p-5">${body}</div>
    </section>`
}

// ─── Page: foundations ──────────────────────────────────────────────────────

export function showcaseFoundations(): string {
  const swatches = each(
    TONES,
    tn => `
    <div class="text-center">
      <div class="h-16 rounded-xl mb-2 ${tones[tn].chip} border ${tones[tn].border} flex items-center justify-center">
        <span class="${tones[tn].text} font-bold text-xs uppercase">${tn}</span>
      </div>
      <p class="text-[10px] text-gray-500 font-mono">${tones[tn].hex}</p>
    </div>`,
  )

  const content = /* html */ `
    ${alert({ tone: 'info', message: 'This page is the living reference. If a component looks wrong here, it is wrong everywhere.' })}

    ${demo('Tones', `<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">${swatches}</div>`,
      'Seven tones, one meaning each. primary = act / succeed, secondary = collaborate / AI, info = neutral data, danger = destroy, warning = pending, accent = highlight, muted = everything else.')}

    ${demo('Surfaces', /* html */ `
      <div class="space-y-3">
        <div class="glass rounded-3xl p-4 text-sm text-gray-300">.glass rounded-3xl — shell panels (sidebar, main, modal)</div>
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-gray-300">bg-white/5 + border-white/10 rounded-2xl — cards</div>
        <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-300">…rounded-xl — dense rows and controls</div>
        <div class="bg-black/30 rounded-lg p-4 text-sm text-gray-400 font-mono">bg-black/30 rounded-lg — code, logs, terminal</div>
      </div>`,
      'Three depths on the gradient: frosted shell, raised card, sunken code.')}

    ${demo('Typography', /* html */ `
      <div class="space-y-3">
        <p class="text-3xl font-bold text-white">Page title — text-3xl font-bold</p>
        <p class="text-xl font-bold text-white">Section — text-xl font-bold</p>
        <p class="text-sm font-bold text-white uppercase tracking-wider">Field label — uppercase tracking-wider</p>
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Eyebrow — tracking-widest</p>
        <p class="text-gray-300">Body copy sits at text-gray-300; supporting copy at text-gray-400; hints at text-gray-500.</p>
        <p class="font-mono text-sm text-purple-300">Monospace — JetBrains Mono, for anything the machine wrote.</p>
      </div>`)}

    ${demo('Radius scale', /* html */ `
      <div class="flex flex-wrap gap-3">
        ${each(
          [
            ['rounded-lg', 'badges, kbd'],
            ['rounded-xl', 'buttons, inputs, rows'],
            ['rounded-2xl', 'cards'],
            ['rounded-3xl', 'shell panels'],
          ],
          ([cls, use]) =>
            `<div class="bg-white/10 ${cls} px-4 py-6 text-center"><p class="text-xs text-white font-mono">${cls}</p><p class="text-[10px] text-gray-500 mt-1">${use}</p></div>`,
        )}
      </div>`)}

    ${demo('Importing', codeBlock({
      code: `import { renderAppLayout, card, button, badge } from '@/ds'

export function renderServersPage(servers: Server[]) {
  return renderAppLayout({
    title: 'My Servers',
    pageDescription: 'Manage your saved SSH connections',
    nav: NAV, active: 'servers',
    user: { name: session.username },
    content: cardGrid(servers.map(s => card({
      title: s.name,
      subtitle: \`\${s.username}@\${s.host}:\${s.port}\`,
      icon: 'server',
      actions: button({ label: 'Connect', href: \`/terminal/\${s.id}\`, size: 'sm', full: true }),
    })).join('')),
  })
}`,
      copyable: true,
    }))}`

  return renderAppLayout({
    title: 'Foundations',
    pageDescription: 'Tones, surfaces, type and spacing — the rules every component obeys',
    nav: NAV,
    active: 'foundations',
    appName: 'GaetanDev DS',
    user: { name: 'Design System', caption: 'Version 1.0' },
    content,
  })
}

// ─── Page: components ───────────────────────────────────────────────────────

export function showcaseComponents(): string {
  const content = /* html */ `
    ${demo('Buttons', /* html */ `
      <div class="space-y-4">
        <div class="flex flex-wrap items-center gap-3">
          ${each(TONES, tn => button({ label: tn, tone: tn }))}
        </div>
        <div class="flex flex-wrap items-center gap-3">
          ${button({ label: 'Soft', tone: 'primary', variant: 'soft' })}
          ${button({ label: 'Ghost', variant: 'ghost' })}
          ${button({ label: 'With icon', icon: 'plus' })}
          ${button({ label: 'Trailing', icon: 'arrowRight', iconRight: true, tone: 'secondary' })}
          ${button({ label: 'Disabled', disabled: true })}
        </div>
        <div class="flex flex-wrap items-center gap-3">
          ${button({ label: 'Small', size: 'sm' })}
          ${button({ label: 'Medium', size: 'md' })}
          ${button({ label: 'Large', size: 'lg' })}
          ${iconButton({ icon: 'edit', title: 'Edit' })}
          ${iconButton({ icon: 'trash', title: 'Delete', tone: 'danger' })}
          ${confirmButton({ action: '#', confirm: 'Delete this?', label: 'Delete', icon: 'trash' })}
        </div>
      </div>`,
      'One solid primary action per screen. Everything else is soft or ghost.')}

    ${demo('Cards', cardGrid(
      card({
        title: 'Production VPS',
        subtitle: 'root@10.0.0.4:22',
        icon: 'server',
        actions: button({ label: 'Connect', size: 'sm', full: true }) + iconButton({ icon: 'edit', title: 'Edit' }),
      }) +
      card({
        title: 'Platform team',
        subtitle: '4 members',
        icon: 'users',
        tone: 'secondary',
        tinted: true,
        badge: badge({ label: 'Owner', tone: 'secondary' }),
        href: '#',
      }) +
      card({
        title: 'Backups',
        subtitle: 'Last run 2 hours ago',
        icon: 'folder',
        tone: 'info',
        body: `<div class="mt-4">${progress({ value: 72, tone: 'info', label: 'Disk used' })}</div>`,
      }),
    ))}

    ${demo('Stats', `<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      ${stat({ label: 'Servers', value: 12, icon: 'server' })}
      ${stat({ label: 'Sessions', value: 3, icon: 'terminal', tone: 'secondary', hint: 'Live right now' })}
      ${stat({ label: 'Failures', value: 0, icon: 'warning', tone: 'danger' })}
    </div>`)}

    ${demo('Rows', rowList(
      row({ title: 'gaetan', subtitle: 'Owner', icon: 'user', tone: 'secondary', actions: button({ label: 'Remove', tone: 'danger', variant: 'soft', size: 'sm' }) }) +
      row({ title: 'alice', subtitle: 'Member', icon: 'user', tone: 'info', actions: button({ label: 'Remove', tone: 'danger', variant: 'soft', size: 'sm' }) }),
    ), 'Actions fade in on hover — the row stays quiet until you reach for it.')}

    ${demo('Badges & status', /* html */ `
      <div class="flex flex-wrap items-center gap-3">
        ${each(TONES, tn => badge({ label: tn, tone: tn }))}
      </div>
      <div class="flex flex-wrap items-center gap-6 mt-4">
        ${status('online', 'Connected')}
        ${status('pending', 'Connecting…')}
        ${status('offline', 'Disconnected')}
        ${status('error', 'Failed')}
        ${avatar({ name: 'Gaetan' })}
        ${avatar({ name: 'Alice', size: 'sm' })}
      </div>`)}

    ${demo('Alerts',
      alert({ tone: 'success', message: 'Server saved.', class: 'mb-3' }) +
      alert({ tone: 'error', message: 'Could not reach the host.', class: 'mb-3' }) +
      alert({ tone: 'warning', message: 'This key has no passphrase.', class: 'mb-3' }) +
      alert({ tone: 'info', title: 'Heads up', message: 'Sessions expire after 12 hours.', class: '' }))}

    ${demo('Form', form({
      action: '#',
      fields:
        input({ name: 'name', label: 'Connection name', placeholder: 'e.g. Production VPS', required: true }) +
        fieldRow([
          input({ name: 'host', label: 'Host', placeholder: '192.168.1.100', required: true, class: 'md:col-span-2' }),
          input({ name: 'port', label: 'Port', type: 'number', value: 22, required: true }),
        ], 3) +
        input({ name: 'bad', label: 'With an error', value: 'nope', error: 'That host is unreachable.' }) +
        radioGroup({ name: 'auth', label: 'Authentication', value: 'password', options: [{ value: 'password', label: 'Password' }, { value: 'key', label: 'SSH key' }] }) +
        select({ name: 'env', label: 'Environment', placeholder: 'Choose…', options: [{ value: 'prod', label: 'Production' }, { value: 'staging', label: 'Staging' }] }) +
        textarea({ name: 'key', label: 'Private key', rows: 3, mono: true, placeholder: '-----BEGIN OPENSSH PRIVATE KEY-----', hint: 'Never leaves your server.' }) +
        checkbox({ name: 'save', label: 'Remember this connection', checked: true }) +
        searchInput({ placeholder: 'Filter servers…', class: 'max-w-xs' }),
      submit: 'Save server',
      cancelHref: '#',
      class: 'space-y-6',
    }))}

    ${demo('Table', table({
      columns: [{ label: 'Name' }, { label: 'Size', align: 'right' }, { label: 'Modified' }, { label: '', align: 'right' }],
      rows: [
        [`<span class="flex items-center gap-2">${icon('folder', 'w-4 h-4 text-blue-400')} config</span>`, '—', 'Sep 12, 2026', iconButton({ icon: 'download', title: 'Download' })],
        [`<span class="flex items-center gap-2">${icon('document', 'w-4 h-4 text-gray-400')} deploy.sh</span>`, '2.4 KB', 'Sep 14, 2026', iconButton({ icon: 'download', title: 'Download' })],
      ],
      hoverActions: true,
    }))}

    ${demo('Definition list & code', /* html */ `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${definitionList([
          { label: 'Host', value: code('10.0.0.4') },
          { label: 'Status', value: status('online', 'Connected') },
          { label: 'Owner', value: 'gaetan' },
        ])}
        ${codeBlock({ code: 'ssh -p 22 root@10.0.0.4\nsudo systemctl restart nginx', copyable: true, label: 'Commands' })}
      </div>`)}

    ${demo('Timeline & progress', /* html */ `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${timeline([
          { title: 'Deployed v1.4.0', caption: '2 minutes ago', tone: 'primary', icon: 'check' },
          { title: 'Tests passed', caption: '6 minutes ago', tone: 'info', icon: 'checkCircle' },
          { title: 'Build queued', caption: '9 minutes ago', tone: 'muted', icon: 'clock' },
        ])}
        <div class="space-y-4">
          ${progress({ value: 92, label: 'CPU', tone: 'danger' })}
          ${progress({ value: 48, label: 'Memory', tone: 'warning' })}
          ${progress({ value: 12, label: 'Disk', tone: 'primary' })}
        </div>
      </div>`)}

    ${demo('Navigation bits', /* html */ `
      ${breadcrumb([{ label: 'Teams', href: '#' }, { label: 'Platform', href: '#' }, { label: 'Settings' }])}
      <div class="flex flex-wrap items-center gap-4 mt-2">
        ${segmented({ items: [{ key: 'term', label: 'Terminal' }, { key: 'sftp', label: 'SFTP' }], active: 'term' })}
        ${segmented({ items: [{ key: 'a', label: 'Members' }, { key: 'b', label: 'Servers' }], active: 'b', tone: 'secondary' })}
        ${dropdown({
          id: 'demoMenu',
          trigger: button({ label: 'Menu', icon: 'chevronDown', iconRight: true, variant: 'ghost', size: 'sm' }),
          items: [
            { label: 'Rename', icon: 'edit' },
            { label: 'Duplicate', icon: 'copy' },
            { label: 'Delete', icon: 'trash', danger: true },
          ],
        })}
      </div>`)}

    ${demo('Overlays', /* html */ `
      <div class="flex gap-3">
        ${button({ label: 'Open modal', onclick: "openModal('demoModal')" })}
        ${button({ label: 'Toast', variant: 'soft', tone: 'secondary', onclick: "toast('Design system loaded','success')" })}
      </div>`)}

    ${demo('Empty states & skeletons', /* html */ `
      ${emptyState({
        icon: 'server',
        title: 'No saved servers yet',
        description: 'Add your first SSH server to get started',
        action: button({ label: 'Add server', icon: 'plus' }),
      })}
      <div class="space-y-2 mt-4">${skeleton('h-4 w-1/3')}${skeleton('h-4 w-2/3')}${skeleton('h-4 w-1/2')}</div>`)}`

  return renderAppLayout({
    title: 'Components',
    pageDescription: 'Every component in the system, rendered from the same code your app calls',
    nav: NAV,
    active: 'components',
    appName: 'GaetanDev DS',
    user: { name: 'Design System', caption: 'Version 1.0' },
    content,
    extra:
      modal({
        id: 'demoModal',
        title: 'Delete this server?',
        description: 'This cannot be undone.',
        body: `<p class="text-sm text-gray-300">The connection details are removed from the database. Nothing happens to the remote machine.</p>`,
        actions:
          button({ label: 'Cancel', variant: 'ghost', onclick: "closeModal('demoModal')" }) +
          button({ label: 'Delete', tone: 'danger' }),
      }) +
      modalScript() +
      dropdownScript(),
  })
}

// ─── Page: patterns ─────────────────────────────────────────────────────────

export function showcasePatterns(): string {
  const content = /* html */ `
    ${sectionHeader({ title: 'List page', icon: 'server', description: 'Header, cards, primary action at the bottom', count: 2 })}
    ${cardGrid(
      card({ title: 'Production VPS', subtitle: 'root@10.0.0.4:22', icon: 'server', actions: button({ label: 'Connect', size: 'sm', full: true }) }) +
      card({ title: 'Staging box', subtitle: 'deploy@10.0.0.9:22', icon: 'server', actions: button({ label: 'Connect', size: 'sm', full: true }) }),
    )}
    <div class="mt-6">${button({ label: 'Add server', icon: 'plus' })}</div>

    <div class="mt-12">
      ${sectionHeader({ title: 'Shared section', icon: 'users', tone: 'secondary', description: 'A second tone marks content that is not yours alone', count: 1 })}
      ${cardGrid(
        card({ title: 'Team database', subtitle: 'ops@10.0.1.2:22', icon: 'server', tone: 'secondary', tinted: true, badge: badge({ label: 'Platform', tone: 'secondary' }), actions: button({ label: 'Connect', tone: 'secondary', size: 'sm', full: true }) }),
        2,
      )}
    </div>

    <div class="mt-12">
      ${sectionHeader({ title: 'Detail page', icon: 'users', tone: 'secondary', description: 'Members list, then shared resources' })}
      ${rowList(
        row({ title: 'gaetan', subtitle: 'Owner', icon: 'user', tone: 'secondary' }) +
        row({ title: 'alice', subtitle: 'Member', icon: 'user', tone: 'info', actions: button({ label: 'Remove', tone: 'danger', variant: 'soft', size: 'sm' }) }),
      )}
      <div class="flex gap-2 mt-4">
        ${searchInput({ placeholder: 'SSO username', class: 'flex-1' })}
        ${button({ label: 'Add member', tone: 'secondary', icon: 'userPlus' })}
      </div>
    </div>

    <div class="mt-12">
      ${sectionHeader({ title: 'Dashboard', icon: 'sparkles', tone: 'accent', description: 'Stats first, then the detail' })}
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        ${stat({ label: 'Servers', value: 12, icon: 'server' })}
        ${stat({ label: 'Teams', value: 3, icon: 'users', tone: 'secondary' })}
        ${stat({ label: 'Sessions', value: 2, icon: 'terminal', tone: 'accent' })}
        ${stat({ label: 'Alerts', value: 1, icon: 'warning', tone: 'warning' })}
      </div>
    </div>`

  return renderAppLayout({
    title: 'Patterns',
    pageDescription: 'How the components fit together into the screens the apps actually have',
    nav: NAV,
    active: 'patterns',
    appName: 'GaetanDev DS',
    user: { name: 'Design System', caption: 'Version 1.0' },
    content,
  })
}

// ─── Page: icons ────────────────────────────────────────────────────────────

export function showcaseIcons(): string {
  const grid = each(
    iconNames,
    n => `
    <button type="button" onclick="navigator.clipboard.writeText('${n}');toast('Copied: ${n}','success')"
      class="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
      ${icon(n, 'w-6 h-6 text-gray-300')}
      <span class="text-[10px] text-gray-500 font-mono truncate w-full text-center">${n}</span>
    </button>`,
  )

  return renderAppLayout({
    title: 'Icons',
    pageDescription: `${iconNames.length} outline icons. Click one to copy its name.`,
    nav: NAV,
    active: 'icons',
    appName: 'GaetanDev DS',
    user: { name: 'Design System', caption: 'Version 1.0' },
    content: `<div class="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">${grid}</div>
      <div class="mt-8">${codeBlock({ code: `icon('server', 'w-5 h-5 text-green-400')`, copyable: true })}</div>`,
  })
}
