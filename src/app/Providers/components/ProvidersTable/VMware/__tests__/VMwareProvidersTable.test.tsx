import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom';
import { Router } from 'react-router-dom';

import VMwareProvidersTable from '../VMwareProvidersTable';
import {
  MOCK_CLUSTER_PROVIDERS,
  MOCK_INVENTORY_PROVIDERS,
} from '@app/queries/mocks/providers.mock';
import { correlateProviders } from '../../helpers';
import { ProviderType } from '@app/common/constants';

describe('<VMwareProvidersTable />', () => {
  const history = createMemoryHistory();
  const props = {
    providers: correlateProviders(
      MOCK_CLUSTER_PROVIDERS,
      MOCK_INVENTORY_PROVIDERS.vsphere,
      ProviderType.vsphere
    ),
  };

  it('renders vsphere table', () => {
    render(
      <Router history={history}>
        <VMwareProvidersTable {...props} />
      </Router>
    );

    expect(screen.getByRole('grid', { name: /VMware providers table/ })).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: /vcenter-1 vcenter.v2v.bos.redhat.com 2 2 41 8 3 Ready/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', {
        name: /vcenter-2 vcenter.v2v.bos.redhat.com 2 2 41 8 3 Critical/,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: /vcenter-3 vcenter.v2v.bos.redhat.com 2 2 41 8 3 Ready/ })
    ).toBeInTheDocument();
  });

  it('renders Hosts links', () => {
    render(
      <Router history={history}>
        <VMwareProvidersTable {...props} />
      </Router>
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2); // NOTE: no link for non-ready vcenter-2 provider
    expect(links[0]).toHaveAttribute('href', '/providers/vsphere/vcenter-1');
    expect(links[1]).toHaveAttribute('href', '/providers/vsphere/vcenter-3');
  });

  it('renders status condition', async () => {
    render(
      <Router history={history}>
        <VMwareProvidersTable {...props} />
      </Router>
    );

    userEvent.click(screen.getByRole('button', { name: /Critical/ }));

    await waitFor(() => {
      expect(screen.getByText('The provider is not responding.')).toBeInTheDocument();
    });
  });

  it('renders action menu', async () => {
    render(
      <Router history={history}>
        <VMwareProvidersTable {...props} />
      </Router>
    );

    userEvent.click(screen.getAllByRole('button', { name: /Actions/ })[0]);

    await waitFor(() => {
      const dropdownEdit = screen.getByRole('menuitem', { name: /Edit/ });
      const actionEdit = screen.getByText(/Edit/);

      expect(dropdownEdit).toHaveTextContent('Edit');
      expect(dropdownEdit).toContainElement(actionEdit);

      const dropdownRemove = screen.getByRole('menuitem', { name: /Remove/ });
      const actionRemove = screen.getByText(/Remove/);

      expect(dropdownRemove).toHaveTextContent('Remove');
      expect(dropdownRemove).toContainElement(actionRemove);
    });
  });
});
