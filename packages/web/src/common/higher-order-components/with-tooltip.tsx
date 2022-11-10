import { Tooltip, TooltipProps } from '@mantine/core';
import React from 'react';

export interface WithTooltipProps {
  tooltipLabel: string;
  tooltipDisabled?: boolean;
}

/**
 * Wraps a Tooltip around a component
 */
export const withTooltip =
  <P extends object>(
    Component: React.ComponentType<P>,
    options?: Omit<TooltipProps, 'label' | 'children'>
  ): React.FC<P & WithTooltipProps> =>
  ({ tooltipLabel, tooltipDisabled, ...rest }: WithTooltipProps) =>
    (
      <Tooltip label={tooltipLabel} disabled={tooltipDisabled} {...options}>
        <div>
          <Component {...(rest as P)} />
        </div>
      </Tooltip>
    );
