import 'package:json_annotation/json_annotation.dart';

part 'user_model.g.dart';

@JsonSerializable()
class UserModel {
  String playerName;
  String clanName;
  int level;
  int xp;
  int xpMax;
  int trophies;
  int currentArena;
  
  // Resources
  int scrolls; // Premium currency
  int books;   // Gold

  // Stats
  int wins;
  int totalDebates;
  int threeCrownWins;
  int crowns;
  int donations;

  // Collection
  @JsonKey(defaultValue: {})
  Map<String, CollectionItem> collection;

  UserModel({
    this.playerName = 'Sábio Viajante',
    this.clanName = 'Escola de Atenas',
    this.level = 1,
    this.xp = 0,
    this.xpMax = 100,
    this.trophies = 0,
    this.currentArena = 1,
    this.scrolls = 0,
    this.books = 0,
    this.wins = 0,
    this.totalDebates = 0,
    this.threeCrownWins = 0,
    this.crowns = 0,
    this.donations = 0,
    this.collection = const {},
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);
  Map<String, dynamic> toJson() => _$UserModelToJson(this);
}

@JsonSerializable()
class CollectionItem {
  int level;
  int count;

  CollectionItem({
    this.level = 1,
    this.count = 0,
  });

  factory CollectionItem.fromJson(Map<String, dynamic> json) => _$CollectionItemFromJson(json);
  Map<String, dynamic> toJson() => _$CollectionItemToJson(this);
}
