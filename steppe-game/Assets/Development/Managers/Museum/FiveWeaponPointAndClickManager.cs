using System;
using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class FiveWeaponPointAndClickManager : MonoBehaviour
{
    [Header("Game Objects")]
    [SerializeField] private GameObject spearGame;
    [SerializeField] private GameObject swordGame;
    [SerializeField] private GameObject bowGame;
    [SerializeField] private GameObject hammerGame;
    [SerializeField] private GameObject axeGame;


    [Header("Game UI")]
    [SerializeField] private GameObject backgroundObject;
    [SerializeField] private GameObject lightObject;
    [SerializeField] private Image background;
    [SerializeField] private Sprite backgroundImageSpear;
    [SerializeField] private Sprite backgroundImageSword;
    [SerializeField] private Sprite backgroundImageAxe;
    [SerializeField] private Sprite backgroundImageBow;
    [SerializeField] private Sprite backgroundImageHammer;
    [SerializeField] private Sprite backgroundImageSpearBlur;
    [SerializeField] private Sprite backgroundImageSwordBlur;
    [SerializeField] private Sprite backgroundImageAxeBlur;
    [SerializeField] private Sprite backgroundImageBowBlur;
    [SerializeField] private Sprite backgroundImageHammerBlur;
    [SerializeField] private GameObject endGamePanel;


    [Header("Spear")]
    [SerializeField] private GameObject spearWinText;
    [SerializeField] private GameObject spearTopDestination;
    [SerializeField] private GameObject spearMiddleDestination;
    [SerializeField] private GameObject spearBottomDestination;
    [SerializeField] private WeaponPart spearTop;
    [SerializeField] private WeaponPart spearMiddle;
    [SerializeField] private WeaponPart spearBottom;

    [Header("Sword")]
    [SerializeField] private GameObject swordWinText;
    [SerializeField] private GameObject swordTopDestination;
    [SerializeField] private GameObject swordMiddleDestination;
    [SerializeField] private GameObject swordBottomDestination;
    [SerializeField] private WeaponPart swordTop;
    [SerializeField] private WeaponPart swordMiddle;
    [SerializeField] private WeaponPart swordBottom;

    [Header("Axe")]
    [SerializeField] private GameObject axeWinText;
    [SerializeField] private GameObject axeTopDestination;
    [SerializeField] private GameObject axeMiddleDestination;
    [SerializeField] private GameObject axeBottomDestination;
    [SerializeField] private WeaponPart axeTop;
    [SerializeField] private WeaponPart axeMiddle;
    [SerializeField] private WeaponPart axeBottom;

    [Header("Bow")]
    [SerializeField] private GameObject bowWinText;
    [SerializeField] private GameObject arrowTopDestination;
    [SerializeField] private GameObject arrowMiddleDestination;
    [SerializeField] private GameObject arrowBottomDestination;
    [SerializeField] private GameObject bowDestination;
    [SerializeField] private WeaponPart arrowTop;
    [SerializeField] private WeaponPart arrowMiddle;
    [SerializeField] private WeaponPart arrowBottom;
    [SerializeField] private WeaponPart bow;

    [Header("Hammer")]
    [SerializeField] private GameObject hammerWinText;
    [SerializeField] private GameObject hammerTopDestination;
    [SerializeField] private GameObject hammerMiddleDestination;
    [SerializeField] private GameObject hammerBottomDestination;
    [SerializeField] private WeaponPart hammerTop;
    [SerializeField] private WeaponPart hammerMiddle;
    [SerializeField] private WeaponPart hammerBottom;

    [Header("Info group text UI")]
    [SerializeField] private TextMeshProUGUI coins;
    [SerializeField] private TextMeshProUGUI points;

    public static event Action OnClickBackToCityButtonAction;
    public static event Action OnClickBackToMuseumButtonAction;

    private StateManager _stateManager;
    private SoundManager _soundManager;

    public void Initialize(StateManager stateManager, SoundManager soundManager)
    {
        _stateManager = stateManager;
        _soundManager = soundManager;
    }

    public void StartNewGame()
    {
        _soundManager.PlayFiveWeaponsInstructionsAudio();

        SetGameBlurActive(false);

        // Disable all game objects
        spearGame.SetActive(false);
        swordGame.SetActive(false);
        axeGame.SetActive(false);
        bowGame.SetActive(false);
        hammerGame.SetActive(false);

        endGamePanel.SetActive(false);

        // Setup background and game object
        switch (_stateManager.FiveWeaponPointAndClickGameType)
        {
            case FiveWeaponsGameType.spear:
                background.sprite = backgroundImageSpear;
                spearGame.SetActive(true);
                _soundManager.PlayMusicSpear();
                break;
            case FiveWeaponsGameType.sword:
                background.sprite = backgroundImageSword;
                swordGame.SetActive(true);
                _soundManager.PlayMusicSword();
                break;
            case FiveWeaponsGameType.axe:
                background.sprite = backgroundImageAxe;
                axeGame.SetActive(true);
                _soundManager.PlayMusicAxe();
                break;
            case FiveWeaponsGameType.bow:
                background.sprite = backgroundImageBow;
                bowGame.SetActive(true);
                _soundManager.PlayMusicBow();
                break;
            case FiveWeaponsGameType.hammer:
                background.sprite = backgroundImageHammer;
                hammerGame.SetActive(true);
                _soundManager.PlayMusicMaze();
                break;
        }

        // Reset all win texts
        spearWinText.SetActive(false);
        swordWinText.SetActive(false);
        axeWinText.SetActive(false);
        bowWinText.SetActive(false);

        // Reset all weapon parts
        spearTop.ResetWeaponPart();
        spearMiddle.ResetWeaponPart();
        spearBottom.ResetWeaponPart();
        swordTop.ResetWeaponPart();
        swordMiddle.ResetWeaponPart();
        swordBottom.ResetWeaponPart();
        axeTop.ResetWeaponPart();
        axeMiddle.ResetWeaponPart();
        axeBottom.ResetWeaponPart();
        bow.ResetWeaponPart();
        arrowMiddle.ResetWeaponPart();
        arrowMiddle.ResetWeaponPart();
        arrowTop.ResetWeaponPart();
        hammerMiddle.ResetWeaponPart();
        hammerMiddle.ResetWeaponPart();
        hammerTop.ResetWeaponPart();
    }

    public void Update()
    {
        IsGameFinished();
    }

    private bool AreObjectsMoving()
    {
        return spearTop.isMoving || spearMiddle.isMoving || spearBottom.isMoving
        || swordTop.isMoving || swordMiddle.isMoving || swordBottom.isMoving
        || axeTop.isMoving || axeMiddle.isMoving || axeBottom.isMoving
        || bow.isMoving || arrowTop.isMoving || arrowMiddle.isMoving || arrowBottom.isMoving
        || bow.isMoving || arrowTop.isMoving || arrowMiddle.isMoving;
    }

    private void OnWeaponPartClick(WeaponPartType weaponPartType)
    {
        if (!AreObjectsMoving())
        {
            switch (_stateManager.FiveWeaponPointAndClickGameType)
            {
                // Spear game
                case FiveWeaponsGameType.spear:
                    {
                        if (weaponPartType == WeaponPartType.spearTop && !spearTop.PartIsInPlace())
                        {
                            spearTop.SetTargetDestination(spearTopDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        else if (weaponPartType == WeaponPartType.spearMiddle && !spearMiddle.PartIsInPlace())
                        {
                            spearMiddle.SetTargetDestination(spearMiddleDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        else if (weaponPartType == WeaponPartType.spearBottom && !spearBottom.PartIsInPlace())
                        {
                            spearBottom.SetTargetDestination(spearBottomDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        break;
                    }
                case FiveWeaponsGameType.sword:
                    {
                        if (weaponPartType == WeaponPartType.swordTop && !swordTop.PartIsInPlace())
                        {
                            swordTop.SetTargetDestination(swordTopDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        else if (weaponPartType == WeaponPartType.swordMiddle && !swordMiddle.PartIsInPlace())
                        {
                            swordMiddle.SetTargetDestination(swordMiddleDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        else if (weaponPartType == WeaponPartType.swordBottom && !swordBottom.PartIsInPlace())
                        {
                            swordBottom.SetTargetDestination(swordBottomDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        break;
                    }
                case FiveWeaponsGameType.hammer:
                    {
                        if (weaponPartType == WeaponPartType.hammerTop && !hammerTop.PartIsInPlace())
                        {
                            hammerTop.SetTargetDestination(hammerTopDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        else if (weaponPartType == WeaponPartType.hammerMiddle && !hammerMiddle.PartIsInPlace())
                        {
                            hammerMiddle.SetTargetDestination(hammerMiddleDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        else if (weaponPartType == WeaponPartType.hammerBottom && !hammerBottom.PartIsInPlace())
                        {
                            hammerBottom.SetTargetDestination(hammerBottomDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        break;
                    }
                case FiveWeaponsGameType.axe:
                    {
                        if (weaponPartType == WeaponPartType.axeTop && !axeTop.PartIsInPlace())
                        {
                            axeTop.SetTargetDestination(axeTopDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        else if (weaponPartType == WeaponPartType.axeMiddle && !axeMiddle.PartIsInPlace())
                        {
                            axeMiddle.SetTargetDestination(axeMiddleDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        else if (weaponPartType == WeaponPartType.axeBottom && !axeBottom.PartIsInPlace())
                        {
                            axeBottom.SetTargetDestination(axeBottomDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        break;
                    }
                case FiveWeaponsGameType.bow:
                    {
                        if (weaponPartType == WeaponPartType.bow && !bow.PartIsInPlace())
                        {
                            bow.SetTargetDestination(bowDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        else if (weaponPartType == WeaponPartType.arrowTop && !arrowTop.PartIsInPlace())
                        {
                            arrowTop.SetTargetDestination(arrowTopDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        else if (weaponPartType == WeaponPartType.arrowMiddle && !arrowMiddle.PartIsInPlace())
                        {
                            arrowMiddle.SetTargetDestination(arrowMiddleDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        else if (weaponPartType == WeaponPartType.arrowBottom && !arrowBottom.PartIsInPlace())
                        {
                            arrowBottom.SetTargetDestination(arrowBottomDestination.transform);
                            _soundManager.PlaySoundWeaponPart();
                        }
                        break;
                    }
            }
        }
    }

    private void IsGameFinished()
    {
        switch (_stateManager.FiveWeaponPointAndClickGameType)
        {
            // Spear game end handler
            case FiveWeaponsGameType.spear:
                {
                    if (spearTop.PartIsInPlace() && spearMiddle.PartIsInPlace() && spearBottom.PartIsInPlace() && !spearWinText.activeSelf)
                    {
                        background.sprite = backgroundImageSpearBlur;
                        SetGameBlurActive(true);

                        _soundManager.PlaySoundSpearWin();
                        StartCoroutine(WaitForTwoSecondsAndPlayAudio(1));

                        spearWinText.SetActive(true);
                    }
                    break;
                }
            case FiveWeaponsGameType.sword:
                {
                    if (swordTop.PartIsInPlace() && swordMiddle.PartIsInPlace() && swordBottom.PartIsInPlace() && !swordWinText.activeSelf)
                    {
                        background.sprite = backgroundImageSwordBlur;
                        SetGameBlurActive(true);

                        _soundManager.PlaySoundSwordWin();
                        StartCoroutine(WaitForTwoSecondsAndPlayAudio(2));

                        swordWinText.SetActive(true);
                    }
                    break;
                }
            case FiveWeaponsGameType.axe:
                {
                    if (axeTop.PartIsInPlace() && axeMiddle.PartIsInPlace() && axeBottom.PartIsInPlace() && !axeWinText.activeSelf)
                    {
                        background.sprite = backgroundImageAxeBlur;
                        SetGameBlurActive(true);

                        _soundManager.PlaySoundAxeWin();
                        StartCoroutine(WaitForTwoSecondsAndPlayAudio(3));

                        axeWinText.SetActive(true);
                    }
                    break;
                }
            case FiveWeaponsGameType.bow:
                {
                    if (bow.PartIsInPlace() && arrowTop.PartIsInPlace() && arrowMiddle.PartIsInPlace() && arrowBottom.PartIsInPlace() && !bowWinText.activeSelf)
                    {
                        background.sprite = backgroundImageBowBlur;
                        SetGameBlurActive(true);

                        _soundManager.PlaySoundBowWin();
                        StartCoroutine(WaitForTwoSecondsAndPlayAudio(4));

                        bowWinText.SetActive(true);
                    }
                    break;
                }
            case FiveWeaponsGameType.hammer:
                {
                    if (hammerTop.PartIsInPlace() && hammerMiddle.PartIsInPlace() && hammerBottom.PartIsInPlace() && !hammerWinText.activeSelf)
                    {
                        background.sprite = backgroundImageHammerBlur;
                        SetGameBlurActive(true);

                        _soundManager.PlaySoundMazeWin();
                        StartCoroutine(WaitForTwoSecondsAndPlayAudio(5));

                        hammerWinText.SetActive(true);
                    }
                    break;
                }
        }
    }

    private void SetGameBlurActive(bool active)
    {
        if (active)
        {
            // Enable blur for background
            backgroundObject.layer = LayerMask.NameToLayer("UIToBlur");
            lightObject.SetActive(true);
        }
        else
        {
            // Disable blur for background
            backgroundObject.layer = LayerMask.NameToLayer("UI");
            lightObject.SetActive(false);
        }
    }

    public void OnNextButtonTap()
    {
        coins.text = "4 тиын";
        points.text = "60 ұпай";

        endGamePanel.SetActive(true);
    }

    public void OnBackToCityClick()
    {
        _soundManager.StopMusic();
        _soundManager.StopVoice();

        _soundManager.PlayAstanaMusic();

        OnClickBackToCityButtonAction?.Invoke();
    }

    public void OnBackToMuseumClick()
    {
        _soundManager.StopMusic();
        _soundManager.StopVoice();

        _soundManager.PlayAstanaMusic();

        OnClickBackToMuseumButtonAction?.Invoke();
    }

    private IEnumerator WaitForTwoSecondsAndPlayAudio(int audioIndex)
    {
        yield return new WaitForSeconds(2f);

        _soundManager.PlayFiveWeaponsAudio(audioIndex);
    }

    public void OnSpearTopClick() => OnWeaponPartClick(WeaponPartType.spearTop);
    public void OnSpearMiddleClick() => OnWeaponPartClick(WeaponPartType.spearMiddle);
    public void OnSpearBottomClick() => OnWeaponPartClick(WeaponPartType.spearBottom);
    public void OnSwordTopClick() => OnWeaponPartClick(WeaponPartType.swordTop);
    public void OnSwordMiddleClick() => OnWeaponPartClick(WeaponPartType.swordMiddle);
    public void OnSwordBottomClick() => OnWeaponPartClick(WeaponPartType.swordBottom);
    public void OnAxeTopClick() => OnWeaponPartClick(WeaponPartType.axeTop);
    public void OnAxeMiddleClick() => OnWeaponPartClick(WeaponPartType.axeMiddle);
    public void OnAxeBottomClick() => OnWeaponPartClick(WeaponPartType.axeBottom);
    public void OnBowClick() => OnWeaponPartClick(WeaponPartType.bow);
    public void OnArrowTopClick() => OnWeaponPartClick(WeaponPartType.arrowTop);
    public void OnArrowMiddleClick() => OnWeaponPartClick(WeaponPartType.arrowMiddle);
    public void OnArrowBottomClick() => OnWeaponPartClick(WeaponPartType.arrowBottom);
    public void OnHammerTopClick() => OnWeaponPartClick(WeaponPartType.hammerTop);
    public void OnHammerMiddleClick() => OnWeaponPartClick(WeaponPartType.hammerMiddle);
    public void OnHammerBottomClick() => OnWeaponPartClick(WeaponPartType.hammerBottom);
}
