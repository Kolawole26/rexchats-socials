export function amountFunction(amount) {
    const newAmount = amount.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return newAmount
    }

    export function getCurrencySymbol(currencyCode) {
        if (currencyCode === 'USD') {
          return '$'
        } else if (currencyCode === 'EUR') {
          return '€'
        } else if (currencyCode === 'GBP') {
          return '£'
        } else if (currencyCode === 'JPY') {
          return '¥'
        } else if (currencyCode === 'AUD') {
            return 'A$'
        } else if (currencyCode === 'CAD') {
            return 'C$'
        } else if (currencyCode === 'NGN') {
            return '₦'
          }
      }

      export const useQueryParams = (params) => {
        /**
         * Clean and return query parameters by removing empty, null, or undefined values.
         * @param {Object} params - The object containing query parameters.
         * @returns {Object} - The cleaned query parameters.
         */
        const cleanQueryParams = () => {
          const cleanedParams = {};
      
          for (const key in params) {
            if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
              cleanedParams[key] = params[key];
            }
          }
      
          return cleanedParams;
        };
      
        return cleanQueryParams();
      };

      export const truncateWord = (word, maxLength = 20) => {
        return word.length > maxLength ? `${word.slice(0, maxLength)}...` : word;
      }


      export const getInitials = (phrase) => {
        if (!phrase) return ''; // Handle empty or null input
      
        // Split the phrase into words
        const words = phrase.split(' ');
      
        // Map through each word and take the first letter, then join them to form initials
        const initials = words.map(word => word[0].toUpperCase()).join('');
      
        return initials;
      }

      export const addSpacesToNumber = (numberString, spaceCount = 4) => {
        const spaces = '&nbsp;'.repeat(spaceCount); // Use &nbsp; for HTML
        return numberString.replace(/(\d{4})/g, `$1${spaces}`);
      }
