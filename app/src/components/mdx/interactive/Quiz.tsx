'use client';

import React from 'react';
import { cn } from '@lib/utils';

interface QuizProps {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export function Quiz({ question, options, correct, explanation }: QuizProps) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const [showResult, setShowResult] = React.useState(false);
  const isCorrect = selected === correct;

  const reset = () => {
    setSelected(null);
    setShowResult(false);
  };

  return (
    <div className="my-6 p-6 border-2 rounded-xl bg-card shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Quiz
      </p>
      <h4 className="text-base font-semibold mb-4">{question}</h4>
      <div className="space-y-2">
        {options && options.map((option, idx) => {
          const isSelected = selected === idx;
          const isCorrectOption = idx === correct;
          let optionClass = 'border hover:bg-muted cursor-pointer';
          if (showResult) {
            if (isCorrectOption) optionClass = 'border-green-500 bg-green-50 dark:bg-green-950/30';
            else if (isSelected) optionClass = 'border-red-400 bg-red-50 dark:bg-red-950/30';
            else optionClass = 'border opacity-50';
          } else if (isSelected) {
            optionClass = 'border-primary bg-primary/5';
          }

          return (
            <label
              key={idx}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-all',
                optionClass,
                showResult ? 'cursor-default' : 'cursor-pointer'
              )}
            >
              <input
                type="radio"
                name={`quiz-${question.slice(0, 10)}`}
                value={idx}
                checked={isSelected}
                onChange={() => !showResult && setSelected(idx)}
                disabled={showResult}
                className="accent-primary"
              />
              <span className="text-sm">{option}</span>
              {showResult && isCorrectOption && (
                <span className="ml-auto text-green-600 text-sm font-medium">✓</span>
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3">
        {!showResult ? (
          <button
            onClick={() => setShowResult(true)}
            disabled={selected === null}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Vérifier
          </button>
        ) : (
          <>
            <div
              className={cn(
                'flex-1 p-3 rounded-lg text-sm font-medium',
                isCorrect
                  ? 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300'
              )}
            >
              {isCorrect ? '✅ Bonne réponse !' : '❌ Pas tout à fait.'}
              {explanation && <p className="mt-1 font-normal opacity-80">{explanation}</p>}
            </div>
            {!isCorrect && (
              <button
                onClick={reset}
                className="px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
              >
                Réessayer
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}