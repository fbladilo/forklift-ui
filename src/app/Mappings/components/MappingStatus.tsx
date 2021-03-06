import * as React from 'react';
import { StatusIcon, StatusType } from '@konveyor/lib-ui';
import { QuerySpinnerMode, ResolvedQueries } from '@app/common/components/ResolvedQuery';
import { useResourceQueriesForMapping } from '@app/queries';
import { MappingType, Mapping } from '@app/queries/types';

import './MappingStatus.css';
import { isMappingValid } from './helpers';
import { Button, Popover } from '@patternfly/react-core';

interface IMappingStatusProps {
  mappingType: MappingType;
  mapping: Mapping;
}

const MappingStatus: React.FunctionComponent<IMappingStatusProps> = ({
  mappingType,
  mapping,
}: IMappingStatusProps) => {
  const { availableSources, availableTargets, queries } = useResourceQueriesForMapping(
    mappingType,
    mapping
  );
  const isValid = isMappingValid(mappingType, mapping, availableSources, availableTargets);
  const icon = (
    <StatusIcon
      status={isValid ? StatusType.Ok : StatusType.Error}
      label={isValid ? 'OK' : 'Invalid'}
    />
  );
  return (
    <ResolvedQueries
      results={queries}
      errorTitles={[
        'Error loading providers',
        'Error loading source provider resources',
        'Error loading target provider resources',
      ]}
      spinnerMode={QuerySpinnerMode.Inline}
      spinnerProps={{
        size: 'md',
        className: 'status-spinner',
      }}
    >
      {isValid ? (
        icon
      ) : (
        <Popover
          hasAutoWidth
          bodyContent="This mapping includes missing source or target resources"
        >
          <Button variant="link" isInline>
            {icon}
          </Button>
        </Popover>
      )}
    </ResolvedQueries>
  );
};

export default MappingStatus;
