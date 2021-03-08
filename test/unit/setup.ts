import { resolve } from 'path';

import * as config from '@/common/config';

config.init({ envFilePath: [resolve(__dirname, '.env.unit')] });
