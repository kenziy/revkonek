<?php

namespace App\Enums;

enum ModificationLevel: string
{
    case STOCK = 'stock';
    case MILD = 'mild';
    case BUILT = 'built';
}
