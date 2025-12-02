// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserModel _$UserModelFromJson(Map<String, dynamic> json) => UserModel(
  playerName: json['playerName'] as String? ?? 'Sábio Viajante',
  clanName: json['clanName'] as String? ?? 'Escola de Atenas',
  level: (json['level'] as num?)?.toInt() ?? 1,
  xp: (json['xp'] as num?)?.toInt() ?? 0,
  xpMax: (json['xpMax'] as num?)?.toInt() ?? 100,
  trophies: (json['trophies'] as num?)?.toInt() ?? 0,
  currentArena: (json['currentArena'] as num?)?.toInt() ?? 1,
  scrolls: (json['scrolls'] as num?)?.toInt() ?? 0,
  books: (json['books'] as num?)?.toInt() ?? 0,
  wins: (json['wins'] as num?)?.toInt() ?? 0,
  totalDebates: (json['totalDebates'] as num?)?.toInt() ?? 0,
  threeCrownWins: (json['threeCrownWins'] as num?)?.toInt() ?? 0,
  crowns: (json['crowns'] as num?)?.toInt() ?? 0,
  donations: (json['donations'] as num?)?.toInt() ?? 0,
  collection:
      (json['collection'] as Map<String, dynamic>?)?.map(
        (k, e) =>
            MapEntry(k, CollectionItem.fromJson(e as Map<String, dynamic>)),
      ) ??
      {},
);

Map<String, dynamic> _$UserModelToJson(UserModel instance) => <String, dynamic>{
  'playerName': instance.playerName,
  'clanName': instance.clanName,
  'level': instance.level,
  'xp': instance.xp,
  'xpMax': instance.xpMax,
  'trophies': instance.trophies,
  'currentArena': instance.currentArena,
  'scrolls': instance.scrolls,
  'books': instance.books,
  'wins': instance.wins,
  'totalDebates': instance.totalDebates,
  'threeCrownWins': instance.threeCrownWins,
  'crowns': instance.crowns,
  'donations': instance.donations,
  'collection': instance.collection,
};

CollectionItem _$CollectionItemFromJson(Map<String, dynamic> json) =>
    CollectionItem(
      level: (json['level'] as num?)?.toInt() ?? 1,
      count: (json['count'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$CollectionItemToJson(CollectionItem instance) =>
    <String, dynamic>{'level': instance.level, 'count': instance.count};
