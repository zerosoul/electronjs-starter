import * as React from 'react';
import Stack from 'components/Stack';
import styles from './styles.module.css';

interface IProps {
  title: string;
  emoji: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function Section({ title, emoji, children }: IProps) {
  return (
    <div>
      <Stack.Row gap="s" className={styles.title}>
        <span role="img" aria-label="">
          {emoji}
        </span>
        <Stack.Expand>{title}</Stack.Expand>
      </Stack.Row>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
