/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React, { useState, useEffect } from 'react';
import {
  EuiComboBox,
  EuiComboBoxOptionProps,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiButtonEmpty,
  EuiSpacer,
  EuiDescribedFormGroup,
  EuiFormRow,
  EuiFieldText,
  EuiText,
  EuiFieldNumber,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { get } from 'lodash';
import { Template } from '../../../../common/types';
import { INVALID_CHARACTERS } from '../../../../common/constants';
import { templatesDocumentationLink } from '../../../lib/documentation_links';
import { loadIndexPatterns } from '../../../services/api';
import { StepProps } from '../types';

const indexPatternIllegalCharacters = INVALID_CHARACTERS.join(' ');

export const StepLogistics: React.FunctionComponent<StepProps> = ({
  template,
  updateTemplate,
  errors,
  isEditing,
}) => {
  const { name, order, version, indexPatterns } = template;
  const { name: nameError, indexPatterns: indexPatternsError } = errors;

  const [allIndexPatterns, setAllIndexPatterns] = useState<Template['indexPatterns']>([]);

  const getIndexPatterns = async () => {
    const indexPatternObjects = await loadIndexPatterns();
    const titles = indexPatternObjects.map((indexPattern: any) =>
      get(indexPattern, 'attributes.title')
    );
    setAllIndexPatterns(titles);
  };

  useEffect(() => {
    getIndexPatterns();
  }, []);

  return (
    <div data-test-subj="stepLogistics">
      <EuiFlexGroup justifyContent="spaceBetween">
        <EuiFlexItem grow={false}>
          <EuiTitle>
            <h3>
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepLogistics.stepTitle"
                defaultMessage="Logistics"
              />
            </h3>
          </EuiTitle>

          <EuiSpacer size="s" />

          <EuiText>
            <p>
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepLogistics.logisticsDescription"
                defaultMessage="Define index patterns and other settings that will be applied to the template."
              />
            </p>
          </EuiText>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiButtonEmpty
            size="s"
            flush="right"
            href={templatesDocumentationLink}
            target="_blank"
            iconType="help"
          >
            <FormattedMessage
              id="xpack.idxMgmt.templateForm.stepLogistics.docsButtonLabel"
              defaultMessage="Index Templates docs"
            />
          </EuiButtonEmpty>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="l" />
      {/* Name */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepLogistics.nameTitle"
                defaultMessage="Name"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.idxMgmt.templateForm.stepLogistics.nameDescription"
            defaultMessage="This name will be used as a unique identifier for this template."
          />
        }
        idAria="stepLogisticsNameDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.idxMgmt.templateForm.stepLogistics.fieldNameLabel"
              defaultMessage="Name (required)"
            />
          }
          isInvalid={Boolean(nameError)}
          error={nameError}
          fullWidth
        >
          <EuiFieldText
            value={name}
            readOnly={isEditing}
            data-test-subj="nameInput"
            onChange={e => {
              updateTemplate({ name: e.target.value });
            }}
            fullWidth
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      {/* Index patterns */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepLogistics.indexPatternsTitle"
                defaultMessage="Index patterns"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.idxMgmt.templateForm.stepLogistics.indexPatternsDescription"
            defaultMessage="Define the index patterns that will be applied to the template."
          />
        }
        idAria="stepLogisticsIndexPatternsDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.idxMgmt.templateForm.stepLogistics.fieldIndexPatternsLabel"
              defaultMessage="Index patterns (required)"
            />
          }
          helpText={
            <FormattedMessage
              id="xpack.idxMgmt.templateForm.stepLogistics.fieldIndexPatternsHelpText"
              defaultMessage="Index patterns must match at least one index. Spaces and the characters {invalidCharactersList} are not allowed."
              values={{
                invalidCharactersList: <strong>{indexPatternIllegalCharacters}</strong>,
              }}
            />
          }
          isInvalid={Boolean(indexPatternsError)}
          error={indexPatternsError}
          fullWidth
        >
          <EuiComboBox
            fullWidth
            options={allIndexPatterns.map(indexPattern => ({
              label: indexPattern,
            }))}
            data-test-subj="indexPatternsComboBox"
            selectedOptions={(indexPatterns || []).map((indexPattern: string) => {
              return {
                label: indexPattern,
                value: indexPattern,
              };
            })}
            onChange={(selectedPattern: EuiComboBoxOptionProps[]) => {
              const newIndexPatterns = selectedPattern.map(({ label }) => label);
              updateTemplate({ indexPatterns: newIndexPatterns });
            }}
            onCreateOption={(selectedPattern: string) => {
              if (!selectedPattern.trim().length) {
                return;
              }

              const newIndexPatterns = [...indexPatterns, selectedPattern];

              setAllIndexPatterns([...allIndexPatterns, selectedPattern]);
              updateTemplate({ indexPatterns: newIndexPatterns });
            }}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      {/* Order */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepLogistics.orderTitle"
                defaultMessage="Order"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.idxMgmt.templateForm.stepLogistics.orderDescription"
            defaultMessage="The order parameter controls the order of merging if multiple templates match an index."
          />
        }
        idAria="stepLogisticsOrderDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.idxMgmt.templateForm.stepLogistics.fieldOrderLabel"
              defaultMessage="Order"
            />
          }
          fullWidth
        >
          <EuiFieldNumber
            value={order}
            onChange={e => {
              const value = e.target.value;
              updateTemplate({ order: value === '' ? value : Number(value) });
            }}
            data-test-subj="orderInput"
            fullWidth
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>{' '}
      {/* Version */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepLogistics.versionTitle"
                defaultMessage="Version"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.idxMgmt.templateForm.stepLogistics.versionDescription"
            defaultMessage="A version number can be used to simplify template management by external systems."
          />
        }
        idAria="stepLogisticsVersionDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.idxMgmt.templateForm.stepLogistics.fieldVersionLabel"
              defaultMessage="Version"
            />
          }
          fullWidth
        >
          <EuiFieldNumber
            value={version}
            onChange={e => {
              const value = e.target.value;
              updateTemplate({ version: value === '' ? value : Number(value) });
            }}
            fullWidth
            data-test-subj="versionInput"
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
    </div>
  );
};
