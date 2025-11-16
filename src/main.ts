type FIOResult = { lastName: string; firstName: string; middleName?: string };
function parseFIO(input: string): FIOResult | null {
    const trimmed = input.trim();
    if (!trimmed) return null;
  
    const parts = trimmed.split(/\s+/).filter(part => part.length > 0);
  
    if (parts.length < 2 || parts.length > 3) return null;
  
    const isValidPart = (str: string) => /^[А-ЯЁ][а-яё]*(?:-[А-ЯЁ][а-яё]*)*$/.test(str);
    
    if (!parts.every(isValidPart)) return null;
  
    const [lastName, firstName, middleName] = parts;
    return { lastName, firstName, middleName: parts.length === 3 ? middleName : undefined };
  }
  
  function formatSignature(fio: { lastName: string; firstName: string; middleName?: string }): string {
    const firstInitial = fio.firstName[0] + '.';
    const middleInitial = fio.middleName ? fio.middleName[0] + '.' : '';
    return `${fio.lastName} ${firstInitial} ${middleInitial}`.trim();
  }
  
  class Calculator {
    evaluate(expression: string): number {
      const cleanExpr = expression.replace(/\s+/g, '');
      
      const tokens = this.tokenize(cleanExpr);
      return this.calculate(tokens);
    }
  
    private tokenize(expression: string): (number | string)[] {
      const tokens: (number | string)[] = [];
      let currentNumber = '';
  
      for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
  
        if (char === '+' || char === '*') {
          if (currentNumber) {
            tokens.push(parseFloat(currentNumber));
            currentNumber = '';
          }
          tokens.push(char);
        } else if (this.isDigit(char) || char === '.') {
          currentNumber += char;
        }
      }
  
      if (currentNumber) {
        tokens.push(parseFloat(currentNumber));
      }
  
      return tokens;
    }
  
    private calculate(tokens: (number | string)[]): number {
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '*') {
          const left = tokens[i - 1] as number;
          const right = tokens[i + 1] as number;
          const result = left * right;
          
          tokens.splice(i - 1, 3, result);
          i--;
        }
      }
  
      let result = tokens[0] as number;
      for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i] as string;
        const number = tokens[i + 1] as number;
  
        if (operator === '+') {
          result += number;
        }
      }
  
      return result;
    }
  
    private isDigit(char: string): boolean {
      return /[\d]/.test(char);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
  
    const fioForm = document.getElementById('fioForm');
    const fullNameInput = document.getElementById('fullName') as HTMLInputElement;
    const fioResult = document.getElementById('fioResult');
  
    if (fioForm && fullNameInput && fioResult) {
      fioForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('FIO form submitted');
  
        const rawValue = fullNameInput.value;
        const parsed = parseFIO(rawValue);
  
        if (!parsed) {
          fioResult.textContent = 'Ошибка: введите корректное ФИО (Фамилия Имя [Отчество])';
          fioResult.classList.add('error');
          fioResult.classList.add('visible');
          return;
        }
  
        const signature = formatSignature(parsed);
        fioResult.textContent = signature;
        fioResult.classList.add('success');
        fioResult.classList.add('visible');
        fioResult.classList.remove('error');
      });
  
      fullNameInput.addEventListener('input', () => {
        fioResult.classList.remove('visible');
        fioResult.classList.remove('error');
        fioResult.classList.remove('success');
      });
    } else {
      console.error('FIO elements not found:', { fioForm, fullNameInput, fioResult });
    }
  
    const calcForm = document.getElementById('calcForm');
    const expressionInput = document.getElementById('expression') as HTMLInputElement;
    const calcResult = document.getElementById('calcResult');
  
    if (calcForm && expressionInput && calcResult) {
      const calculator = new Calculator();
  
      calcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Calc form submitted');
  

        const expression = expressionInput.value;

        try {
          const result = calculator.evaluate(expression);
          calcResult.textContent = `Результат: ${result}`;
          calcResult.classList.add('success');
          calcResult.classList.remove('error');
          calcResult.classList.add('visible');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          calcResult.textContent = `Ошибка: ${errorMessage}`;
          calcResult.classList.add('error');
          calcResult.classList.remove('success');
          calcResult.classList.add('visible');
        }
      });
  
      expressionInput.addEventListener('input', () => {
        const cleaned = expressionInput.value.replace(/[^\d\.\+\*\s]/g, '');
        if (cleaned !== expressionInput.value) {
          expressionInput.value = cleaned;
        }
        
        calcResult.classList.remove('visible');
        calcResult.classList.remove('error');
        calcResult.classList.remove('success');
      });
    } else {
      console.error('Calculator elements not found:', { calcForm, expressionInput, calcResult });
    }
  });
  